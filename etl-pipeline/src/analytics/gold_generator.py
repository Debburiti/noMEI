"""
Gerador da camada Gold.

Responsável por:
- Persistir datasets analíticos
- Exportar resultados em CSV
- Exportar resultados em Parquet
- Centralizar saída da camada Gold
"""

import logging
import os

import duckdb
from pyspark.sql import DataFrame

from config.settings import Settings

logger = logging.getLogger(__name__)


def save_gold_outputs(
    dataframes: dict[str, DataFrame],
    settings: Settings | None = None,
) -> None:
    """
    Salva datasets Gold em CSV e Parquet.

    Args:
        dataframes (dict):
            DataFrames analíticos.
    """

    logger.info(
        "Persistindo datasets Gold"
    )

    settings = settings or Settings()
    base_path = settings.GOLD_OUTPUT_PATH

    os.makedirs(
        base_path,
        exist_ok=True,
    )

    for nome, df in dataframes.items():

        csv_path = (
            f"{base_path}/{nome}/csv"
        )

        parquet_path = (
            f"{base_path}/{nome}/parquet"
        )

        logger.info(
            "Salvando dataset: %s",
            nome,
        )

        (
            df.coalesce(1)
            .write
            .mode("overwrite")
            .option(
                "header",
                True,
            )
            .csv(csv_path)
        )

        (
            df.write
            .mode("overwrite")
            .parquet(parquet_path)
        )

        logger.info(
            "Dataset salvo: %s",
            nome,
        )


def save_gold_duckdb(
    dataframes: dict[str, DataFrame],
    settings: Settings | None = None,
) -> None:
    """
    Persiste a camada Gold em DuckDB.

    DuckDB funciona como banco analitico/colunar local para consultas SQL
    sobre os agregados, complementando o MongoDB documental usado na Silver.
    """

    settings = settings or Settings()
    db_path = settings.GOLD_DUCKDB_PATH

    os.makedirs(
        os.path.dirname(db_path),
        exist_ok=True,
    )

    logger.info(
        "Persistindo camada Gold em DuckDB: %s",
        db_path,
    )

    with duckdb.connect(db_path) as conn:
        for nome, df in dataframes.items():
            pandas_df = df.toPandas()
            conn.register("gold_df", pandas_df)
            conn.execute(f'CREATE OR REPLACE TABLE "{nome}" AS SELECT * FROM gold_df')
            conn.unregister("gold_df")

            logger.info(
                "Tabela DuckDB atualizada: %s (%d linhas)",
                nome,
                len(pandas_df),
            )
