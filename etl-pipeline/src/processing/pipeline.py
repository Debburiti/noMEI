"""
Módulo de orquestração do pipeline ETL do PNCP.
"""

import logging
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any

from config.settings import Settings
from src.ingestion.extractor import PNCPExtractor
from src.processing.transformer import PNCPTransformer
from src.storage.loader import MongoDBLoader
from src.security.audit import log_event

logger = logging.getLogger(__name__)


@dataclass
class PipelineResult:
    total_extraido: int = 0
    total_transformado: int = 0
    total_inserido: int = 0
    total_atualizado: int = 0
    total_erros: int = 0
    inicio: datetime = datetime.now(tz=timezone.utc)
    fim: datetime | None = None

    @property
    def sucesso(self) -> bool:
        return self.total_erros == 0

    def resumo(self) -> str:
        duracao = (
            (self.fim - self.inicio).total_seconds()
            if self.fim
            else 0
        )

        return (
            f"Sucesso: {self.sucesso} | "
            f"Duração: {duracao:.1f}s | "
            f"Extraídos: {self.total_extraido} | "
            f"Transformados: {self.total_transformado} | "
            f"Inseridos: {self.total_inserido} | "
            f"Atualizados: {self.total_atualizado} | "
            f"Erros: {self.total_erros}"
        )


class ETLPipeline:

    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.extractor = PNCPExtractor(settings)
        self.transformer = PNCPTransformer()
        self.loader = MongoDBLoader(settings)

    def run(
        self,
        extract_params: dict[str, Any]
    ) -> PipelineResult:

        logger.info(
            "=== Iniciando pipeline ETL PNCP ==="
        )

        logger.info(
            "Parâmetros de extração: %s",
            extract_params
        )

        log_event(
            "etl_started",
            {
                "source": "PNCP",
                "params": extract_params,
            }
        )

        start_time = time.time()

        result = PipelineResult()

        try:

            with self.loader:

                buffer: list[dict] = []

                extract_params.setdefault(
                    "page_size",
                    self.settings.PAGE_SIZE
                )

                for raw_record in self.extractor.extract(
                    **extract_params
                ):

                    result.total_extraido += 1

                    buffer.append(raw_record)

                    if (
                        len(buffer)
                        >= self.settings.BATCH_SIZE
                    ):
                        self._process_batch(
                            buffer,
                            result
                        )

                        buffer.clear()

                if buffer:
                    self._process_batch(
                        buffer,
                        result
                    )

        except Exception as e:

            logger.exception(
                "Erro crítico no pipeline: %s",
                str(e)
            )

            log_event(
                "etl_error",
                {
                    "error": str(e)
                }
            )

            result.total_erros += 1

        result.fim = datetime.now(
            tz=timezone.utc
        )

        logger.info(
            "Pipeline finalizado em %.2fs",
            time.time() - start_time
        )

        logger.info(
            "Pipeline ETL PNCP | %s",
            result.resumo()
        )

        log_event(
            "etl_finished",
            {
                "extraidos":
                    result.total_extraido,
                "transformados":
                    result.total_transformado,
                "inseridos":
                    result.total_inserido,
                "atualizados":
                    result.total_atualizado,
                "erros":
                    result.total_erros,
                "sucesso":
                    result.sucesso,
            }
        )

        return result

    def _process_batch(
        self,
        buffer: list[dict[str, Any]],
        result: PipelineResult,
    ) -> None:

        logger.info(
            "Processando batch de %d registros (com CNAE + MEI)",
            len(buffer),
        )

        contratacoes = []
        orgaos = []

        for record in buffer:

            try:

                doc = self.transformer.transform(record)

                contratacoes.append(doc)

                orgao = doc.get("orgaoEntidade")

                if isinstance(orgao, dict):

                    orgao_doc = {
                        "_id":
                            orgao.get("cnpj"),
                        "razaoSocial":
                            orgao.get("razaoSocial"),
                        "uf":
                            orgao.get("ufSigla"),
                        "_etl_ingestao_em":
                            doc["_etl_ingestao_em"],
                    }

                    if orgao_doc["_id"]:
                        orgaos.append(orgao_doc)

            except Exception as e:

                logger.exception("Erro ao transformar registro")

                log_event(
                    "transform_error",
                    {
                        "numeroControlePNCP":
                            record.get("numeroControlePNCP"),
                        "error":str(e),
                    }
                )

                result.total_erros += 1

        result.total_transformado += len(contratacoes)

        summary = self.loader.load_batch(contratacoes)

        result.total_inserido += summary["inserted"]

        result.total_atualizado += summary["modified"]

        result.total_erros += summary["errors"]

        if orgaos:
            self.loader.load_into_collection(
                orgaos,
                self.settings.MONGODB_ORGAOS_COLLECTION,
            )
