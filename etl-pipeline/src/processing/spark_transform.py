"""
Pipeline analítica utilizando PySpark.

Responsável por:
- Ler dados tratados do MongoDB Atlas
- Criar DataFrames Spark
- Construir camada Gold analítica
- Gerar métricas para análise de dados
- Exportar datasets em CSV e Parquet
- Aplicar boas práticas de Engenharia de Dados/DataOps

Arquitetura medalhão:
- Bronze → API PNCP
- Silver → MongoDB tratado via ETL
- Gold → Camada analítica Spark
"""

import logging
import os
from typing import Any

from dotenv import load_dotenv
from pymongo import MongoClient
from pyspark.sql import DataFrame, SparkSession
from pyspark.sql.functions import (
    avg,
    col,
    count,
    desc,
    max,
    round,
)

from config.settings import Settings
from src.analytics.gold_generator import save_gold_duckdb

load_dotenv()

# ==========================================================
# LOGGING
# ==========================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)

logger = logging.getLogger(__name__)


# ==========================================================
# SPARK SESSION
# ==========================================================

def create_spark_session() -> SparkSession:
    """
    Cria sessão Spark local.

    Returns:
        SparkSession:
            Sessão Spark configurada.
    """

    logger.info("Inicializando Spark Session")

    spark = (
        SparkSession.builder
        .appName("noMEI-Gold-Layer")
        .master("local[*]")
        .config("spark.sql.shuffle.partitions", "4")
        .getOrCreate()
    )

    spark.sparkContext.setLogLevel("ERROR")

    return spark


# ==========================================================
# EXTRACT - SILVER LAYER
# ==========================================================

def extract_mongodb_data() -> list[dict]:
    """
    Extrai dados tratados do MongoDB Atlas.

    Returns:
        list[dict]:
            Lista de documentos da camada Silver.
    """

    logger.info("Conectando ao MongoDB Atlas")

    settings = Settings()
    mongodb_uri = settings.MONGODB_URI

    if not mongodb_uri:
        raise ValueError(
            "Variável MONGODB_URI não encontrada."
        )

    client = MongoClient(mongodb_uri)

    db = client[settings.MONGODB_DATABASE]
    collection = db[settings.MONGODB_COLLECTION]

    logger.info("Extraindo documentos da coleção")

    documentos = list(
        collection.find(
            {},
            {
                "_id": 0,
            }
        )
    )

    client.close()

    logger.info(
        "Total de documentos extraídos: %d",
        len(documentos),
    )

    return documentos


# ==========================================================
# DATAFRAME
# ==========================================================

def _collect_numeric_paths(
    value: Any,
    path: tuple[str, ...],
    types_by_path: dict[tuple[str, ...], set[type]],
) -> None:
    """
    Mapeia os tipos numéricos encontrados em cada campo.

    O Spark falha ao inferir schema quando o mesmo campo vem em alguns
    documentos como int e em outros como float.
    """

    if isinstance(value, dict):
        for key, item in value.items():
            _collect_numeric_paths(
                item,
                path + (key,),
                types_by_path,
            )
        return

    if isinstance(value, list):
        for item in value:
            _collect_numeric_paths(
                item,
                path,
                types_by_path,
            )
        return

    if isinstance(value, bool):
        return

    if isinstance(value, (int, float)):
        types_by_path.setdefault(path, set()).add(type(value))


def _normalize_numeric_paths(
    value: Any,
    path: tuple[str, ...],
    paths_to_float: set[tuple[str, ...]],
) -> Any:
    """
    Converte para float apenas campos que misturam int e float.
    """

    if isinstance(value, dict):
        return {
            key: _normalize_numeric_paths(
                item,
                path + (key,),
                paths_to_float,
            )
            for key, item in value.items()
        }

    if isinstance(value, list):
        return [
            _normalize_numeric_paths(
                item,
                path,
                paths_to_float,
            )
            for item in value
        ]

    if path in paths_to_float and isinstance(value, int) and not isinstance(value, bool):
        return float(value)

    return value


def normalize_numeric_types(data: list[dict]) -> list[dict]:
    """
    Padroniza campos numéricos com tipos mistos antes da inferência do Spark.
    """

    types_by_path: dict[tuple[str, ...], set[type]] = {}

    for document in data:
        _collect_numeric_paths(
            document,
            (),
            types_by_path,
        )

    paths_to_float = {
        path
        for path, types in types_by_path.items()
        if int in types and float in types
    }

    if not paths_to_float:
        return data

    logger.info(
        "Normalizando %d campos com mistura de int e float para float",
        len(paths_to_float),
    )

    return [
        _normalize_numeric_paths(
            document,
            (),
            paths_to_float,
        )
        for document in data
    ]


def create_dataframe(
    spark: SparkSession,
    data: list,
) -> DataFrame:
    """
    Cria DataFrame Spark.

    Args:
        spark (SparkSession):
            Sessão Spark.

        data (list):
            Dados extraídos do MongoDB.

    Returns:
        DataFrame:
            DataFrame Spark estruturado.
    """

    logger.info("Criando DataFrame Spark")

    data = normalize_numeric_types(data)

    df = spark.createDataFrame(data)

    logger.info("Persistindo DataFrame em memória")

    df.cache()

    return df


# ==========================================================
# GOLD LAYER
# ==========================================================

def build_gold_layer(df: DataFrame) -> dict[str, DataFrame]:
    """
    Constrói camada Gold analítica.

    Args:
        df (DataFrame):
            DataFrame Silver.

    Returns:
        dict[str, DataFrame]:
            DataFrames analíticos.
    """

    logger.info("Construindo camada Gold")

    # ======================================================
    # OPORTUNIDADES POR UF
    # ======================================================

    oportunidades_por_uf = (
        df.groupBy("unidadeOrgao.ufSigla")
        .agg(
            count("*").alias("total_oportunidades")
        )
        .orderBy(
            desc("total_oportunidades")
        )
    )

    # ======================================================
    # MÉDIA POR MODALIDADE
    # ======================================================

    media_por_modalidade = (
        df.groupBy("modalidadeNome")
        .agg(
            round(
                avg("valorTotalEstimado"),
                2,
            ).alias("media_valor")
        )
        .orderBy(
            desc("media_valor")
        )
    )

    # ======================================================
    # OPORTUNIDADES MEI
    # ======================================================

    oportunidades_mei = (
        df.filter(
            col("_mei_compativel") == True
        )
        .groupBy("unidadeOrgao.ufSigla")
        .agg(
            count("*").alias("total_mei")
        )
        .orderBy(
            desc("total_mei")
        )
    )

    # ======================================================
    # TOP ÓRGÃOS
    # ======================================================

    top_orgaos = (
        df.groupBy("orgaoEntidade.razaoSocial")
        .agg(
            count("*").alias("total_editais")
        )
        .orderBy(
            desc("total_editais")
        )
    )

    # ======================================================
    # MAIORES EDITAIS
    # ======================================================

    maiores_editais = (
        df.select(
            "objetoCompra",
            "valorTotalEstimado",
            "modalidadeNome",
        )
        .orderBy(
            desc("valorTotalEstimado")
        )
        .limit(10)
    )

    # ======================================================
    # MAIOR VALOR POR UF
    # ======================================================

    maior_valor_por_uf = (
        df.groupBy("unidadeOrgao.ufSigla")
        .agg(
            max("valorTotalEstimado")
            .alias("maior_valor")
        )
        .orderBy(
            desc("maior_valor")
        )
    )

    logger.info("Camada Gold construída com sucesso")

    return {
        "oportunidades_por_uf": oportunidades_por_uf,
        "media_por_modalidade": media_por_modalidade,
        "oportunidades_mei": oportunidades_mei,
        "top_orgaos": top_orgaos,
        "maiores_editais": maiores_editais,
        "maior_valor_por_uf": maior_valor_por_uf,
    }


# ==========================================================
# SHOW RESULTS
# ==========================================================

def show_results(
    dataframes: dict[str, DataFrame],
) -> None:
    """
    Exibe resultados analíticos.

    Args:
        dataframes (dict):
            DataFrames da camada Gold.
    """

    logger.info("Exibindo resultados analíticos")

    for nome, df in dataframes.items():

        print(f"\n=== {nome.upper()} ===")

        df.show(
            truncate=False,
        )


# ==========================================================
# SAVE OUTPUTS
# ==========================================================

def save_outputs(
    dataframes: dict[str, DataFrame],
) -> None:
    """
    Salva datasets Gold em CSV e Parquet.

    Args:
        dataframes (dict):
            DataFrames analíticos.
    """

    logger.info("Persistindo datasets Gold")

    settings = Settings()
    base_path = settings.GOLD_OUTPUT_PATH

    os.makedirs(base_path, exist_ok=True)

    for nome, df in dataframes.items():

        csv_path = f"{base_path}/{nome}/csv"
        parquet_path = f"{base_path}/{nome}/parquet"

        logger.info(
            "Salvando dataset: %s",
            nome,
        )

        # CSV
        (
            df.coalesce(1)
            .write
            .mode("overwrite")
            .option("header", True)
            .csv(csv_path)
        )

        # PARQUET
        (
            df.write
            .mode("overwrite")
            .parquet(parquet_path)
        )

        logger.info(
            "Dataset salvo: %s",
            nome,
        )

    save_gold_duckdb(dataframes)


# ==========================================================
# MAIN PIPELINE
# ==========================================================

def main() -> None:
    """
    Executa pipeline analítica Spark.
    """

    logger.info(
        "=== INICIANDO PIPELINE ANALÍTICA SPARK ==="
    )

    spark = create_spark_session()

    data = extract_mongodb_data()

    if not data:

        logger.warning(
            "Nenhum dado encontrado no MongoDB."
        )

        spark.stop()

        return

    df = create_dataframe(
        spark,
        data,
    )

    logger.info("Schema do DataFrame")

    df.printSchema()

    logger.info("Exibindo amostra dos dados")

    df.show(
        5,
        truncate=False,
    )

    gold_layer = build_gold_layer(df)

    show_results(gold_layer)

    save_outputs(gold_layer)

    logger.info(
        "=== PIPELINE ANALÍTICA FINALIZADA ==="
    )

    spark.stop()


# ==========================================================
# ENTRYPOINT
# ==========================================================

if __name__ == "__main__":
    main()
