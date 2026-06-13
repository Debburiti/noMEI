"""
Módulo de orquestração do pipeline ETL do PNCP utilizando Prefect.

Responsável por:
- Definir tarefas monitoráveis (@task)
- Coordenar o fluxo de execução (@flow)
- Adicionar logs e controle de falhas (retries)
- Permitir execução incremental automática
- Possibilitar futura automação via agendamento

Este módulo integra o pipeline ETL já existente com um orquestrador,
permitindo observabilidade, monitoramento e reexecução controlada.
"""

from datetime import datetime, timedelta
from typing import Any

from dotenv import load_dotenv
from prefect import flow, get_run_logger, task

from config.settings import Settings
from src.ingestion.extractor import PNCPExtractor
from src.processing.pipeline import ETLPipeline
from src.processing.transformer import PNCPTransformer
from src.storage.loader import MongoDBLoader

load_dotenv()


@task(
    name="extract_pncp",
    retries=3,
    retry_delay_seconds=10,
)
def extract_pncp(
    data_inicial: str,
    data_final: str,
    max_paginas: int | None = None,
) -> list[dict[str, Any]]:
    """Extrai registros brutos da API PNCP em janela incremental."""

    logger = get_run_logger()
    settings = Settings()
    extractor = PNCPExtractor(settings)

    extract_params = {
        "data_inicial": data_inicial,
        "data_final": data_final,
        "max_paginas": max_paginas,
        "page_size": settings.PAGE_SIZE,
    }

    logger.info("Iniciando Extract com parâmetros: %s", extract_params)
    records = list(extractor.extract(**extract_params))
    logger.info("Extract finalizado com %d registros", len(records))

    return records


@task(
    name="transform_pncp",
    retries=2,
    retry_delay_seconds=5,
)
def transform_pncp(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Normaliza registros PNCP para documentos Silver."""

    logger = get_run_logger()
    transformer = PNCPTransformer()

    documents = transformer.transform_batch(records)

    logger.info(
        "Transform finalizado: %d/%d documentos válidos",
        len(documents),
        len(records),
    )

    return documents


@task(
    name="load_mongodb",
    retries=3,
    retry_delay_seconds=10,
)
def load_mongodb(documents: list[dict[str, Any]]) -> dict[str, int]:
    """Persiste documentos curados no MongoDB Atlas com upsert."""

    logger = get_run_logger()
    settings = Settings()
    settings.validate()

    orgaos: list[dict[str, Any]] = []

    for doc in documents:
        orgao = doc.get("orgaoEntidade")

        if isinstance(orgao, dict) and orgao.get("cnpj"):
            orgaos.append(
                {
                    "_id": orgao["cnpj"],
                    "razaoSocial": orgao.get("razaoSocial"),
                    "uf": orgao.get("ufSigla"),
                    "_etl_ingestao_em": doc.get("_etl_ingestao_em"),
                }
            )

    with MongoDBLoader(settings) as loader:
        summary = loader.load_batch(documents)

        if orgaos:
            loader.load_into_collection(
                orgaos,
                settings.MONGODB_ORGAOS_COLLECTION,
            )

    logger.info("Load finalizado: %s", summary)

    return summary


@task(
    name="run_etl_compacto",
    retries=3,
    retry_delay_seconds=10,
)
def run_etl(
    data_inicial: str,
    data_final: str,
    max_paginas: int | None = None,
) -> bool:
    """
    Executa o pipeline ETL do PNCP como uma task monitorável.

    Args:
        data_inicial (str):
            Data inicial da extração no formato YYYYMMDD.

        data_final (str):
            Data final da extração no formato YYYYMMDD.

        max_paginas (int | None):
            Limite de páginas para testes e desenvolvimento.

    Returns:
        bool:
            True se execução concluída com sucesso.
    """

    logger = get_run_logger()

    logger.info("Inicializando pipeline ETL")

    settings = Settings()
    pipeline = ETLPipeline(settings)

    extract_params = {
        "data_inicial": data_inicial,
        "data_final": data_final,
        "max_paginas": max_paginas,
    }

    logger.info(
        "Parâmetros da execução: %s",
        extract_params,
    )

    result = pipeline.run(extract_params)

    logger.info("ETL finalizado")
    logger.info("Sucesso: %s", result.sucesso)
    logger.info("Total extraído: %s", result.total_extraido)
    logger.info("Total transformado: %s", result.total_transformado)
    logger.info("Total inserido: %s", result.total_inserido)
    logger.info("Total atualizado: %s", result.total_atualizado)
    logger.info("Total erros: %s", result.total_erros)

    return result.sucesso


@flow(
    name="ETL PNCP Flow",
    log_prints=True,
)
def etl_flow(
    dias_retroativos: int = 1,
    max_paginas: int = 1,
) -> None:
    """
    Define o fluxo orquestrado do pipeline ETL.

    A pipeline executa de forma incremental automática:

    - data_final = data atual
    - data_inicial = data atual - dias_retroativos

    Args:
        dias_retroativos (int):
            Quantidade de dias retroativos para busca.

        max_paginas (int):
            Limite de páginas para testes.
    """

    logger = get_run_logger()

    hoje = datetime.now()
    data_inicio = hoje - timedelta(days=dias_retroativos)

    data_final = hoje.strftime("%Y%m%d")
    data_inicial = data_inicio.strftime("%Y%m%d")

    logger.info(
        "Iniciando execução incremental: %s → %s",
        data_inicial,
        data_final,
    )

    logger.info(
        "Limite de páginas configurado: %s",
        max_paginas,
    )

    raw_records = extract_pncp(
        data_inicial=data_inicial,
        data_final=data_final,
        max_paginas=max_paginas,
    )

    documents = transform_pncp(raw_records)
    load_summary = load_mongodb(documents)

    logger.info("Resumo da carga MongoDB: %s", load_summary)
    logger.info("Flow ETL PNCP finalizada com sucesso")


if __name__ == "__main__":
    """
    Ponto de entrada para execução manual do fluxo.

    Exemplos:

    Execução padrão:
        python orchestrate_prefect.py

    Execução retroativa:
        etl_flow(dias_retroativos=7)

    Execução maior:
        etl_flow(
            dias_retroativos=3,
            max_paginas=10,
        )
    """

    etl_flow(
        dias_retroativos=1,
        max_paginas=1,
    )
