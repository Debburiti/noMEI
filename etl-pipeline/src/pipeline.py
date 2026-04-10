"""
Módulo orquestrador do pipeline ETL do PNCP.

Coordena as etapas de Extração, Transformação e Carga, gerenciando
ciclo de vida dos componentes e estatísticas de execução.
"""

import logging
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any

from config.settings import Settings
from src.extractor import PNCPExtractor
from src.loader import MongoDBLoader
from src.transformer import PNCPTransformer

logger = logging.getLogger(__name__)


@dataclass
class PipelineResult:
    """
    Resultado consolidado de uma execução do pipeline ETL.

    Attributes:
        inicio (datetime): Momento de início da execução.
        fim (datetime | None): Momento de término da execução.
        total_extraido (int): Total de registros extraídos da API.
        total_transformado (int): Total de registros transformados com sucesso.
        total_inserido (int): Registros novos inseridos no banco.
        total_atualizado (int): Registros existentes atualizados no banco.
        total_erros (int): Total de registros com falha em qualquer etapa.
        sucesso (bool): Indica se o pipeline concluiu sem erros críticos.
    """

    inicio: datetime = field(default_factory=lambda: datetime.now(tz=timezone.utc))
    fim: datetime | None = None
    total_extraido: int = 0
    total_transformado: int = 0
    total_inserido: int = 0
    total_atualizado: int = 0
    total_erros: int = 0
    sucesso: bool = False

    @property
    def duracao_segundos(self) -> float | None:
        """Calcula a duração em segundos da execução do pipeline."""
        if self.fim:
            return (self.fim - self.inicio).total_seconds()
        return None

    def resumo(self) -> str:
        """Retorna uma string formatada com o resumo da execução."""
        return (
            f"Pipeline ETL PNCP | Sucesso: {self.sucesso} | "
            f"Duração: {self.duracao_segundos:.1f}s | "
            f"Extraídos: {self.total_extraido} | "
            f"Transformados: {self.total_transformado} | "
            f"Inseridos: {self.total_inserido} | "
            f"Atualizados: {self.total_atualizado} | "
            f"Erros: {self.total_erros}"
        )


class ETLPipeline:
    """
    Orquestrador do pipeline ETL para dados de contratações do PNCP.

    O fluxo é:
    1. **Extract** — ``PNCPExtractor`` busca dados paginados da API REST.
    2. **Transform** — ``PNCPTransformer`` normaliza e enriquece os registros.
    3. **Load** — ``MongoDBLoader`` persiste os documentos no MongoDB Atlas via upsert.

    O processamento é feito em micro-lotes para equilibrar uso de memória
    e eficiência de rede (menor número de round-trips ao banco).

    Attributes:
        settings (Settings): Configurações da aplicação.
        extractor (PNCPExtractor): Componente de extração.
        transformer (PNCPTransformer): Componente de transformação.
        loader (MongoDBLoader): Componente de carga.
    """

    def __init__(self, settings: Settings) -> None:
        """
        Inicializa o pipeline com os três componentes ETL.

        Args:
            settings (Settings): Configurações centralizadas da aplicação.
        """
        self.settings = settings
        self.extractor = PNCPExtractor(settings)
        self.transformer = PNCPTransformer()
        self.loader = MongoDBLoader(settings)

    def run(self, extract_params: dict[str, Any]) -> PipelineResult:
        """
        Executa o pipeline ETL completo para os parâmetros fornecidos.

        Args:
            extract_params (dict): Parâmetros de filtro para a API. Chaves aceitas:
                - ``data_final`` (str, obrigatório): Data final no formato YYYYMMDD.
                - ``data_inicial`` (str, opcional): Data inicial no formato YYYYMMDD.
                - ``uf`` (str, opcional): Sigla da UF.
                - ``codigo_modalidade`` (int, opcional): Código da modalidade.
                - ``cnpj`` (str, opcional): CNPJ do órgão.
                - ``codigo_municipio_ibge`` (str, opcional): Código IBGE do município.
                - ``codigo_unidade_administrativa`` (str, opcional): Código da unidade.

        Returns:
            PipelineResult: Objeto com estatísticas da execução.
        """
        result = PipelineResult()
        logger.info("=== Iniciando pipeline ETL PNCP ===")
        logger.info("Parâmetros de extração: %s", extract_params)

        try:
            with self.loader:
                buffer: list[dict[str, Any]] = []

                for raw_record in self.extractor.extract(**extract_params):
                    result.total_extraido += 1
                    buffer.append(raw_record)

                    # Processa em micro-lotes para eficiência
                    if len(buffer) >= self.settings.BATCH_SIZE:
                        self._process_batch(buffer, result)
                        buffer.clear()

                # Processa registros restantes no buffer
                if buffer:
                    self._process_batch(buffer, result)

            result.sucesso = True

        except Exception:
            logger.exception("Erro crítico no pipeline ETL.")
            result.sucesso = False
        finally:
            self.extractor.close()
            result.fim = datetime.now(tz=timezone.utc)
            logger.info(result.resumo())

        return result

    def _process_batch(
        self, buffer: list[dict[str, Any]], result: PipelineResult
    ) -> None:
        """
        Transforma e carrega um lote de registros brutos.

        Args:
            buffer (list[dict]): Lote de registros brutos para processar.
            result (PipelineResult): Objeto de resultado a ser atualizado com as contagens.
        """
        transformed = self.transformer.transform_batch(buffer)
        erros_transform = len(buffer) - len(transformed)
        result.total_erros += erros_transform
        result.total_transformado += len(transformed)

        if transformed:
            summary = self.loader.load_batch(transformed)
            result.total_inserido += summary["inserted"]
            result.total_atualizado += summary["modified"]
            result.total_erros += summary["errors"]
