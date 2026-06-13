"""
Módulo de transformação de dados do PNCP.

Responsável por limpar, normalizar e enriquecer os registros brutos
retornados pela API, preparando-os para persistência no MongoDB.
"""

import logging
from decimal import Decimal, InvalidOperation
from datetime import datetime, timezone
from typing import Any

from src.contracts import BaseTransformer
from src.security.lgpd import remove_sensitive_fields
from src.security.anonymizer import pseudonymize_field

logger = logging.getLogger(__name__)

_DATE_FIELDS = (
    "dataAtualizacao",
    "dataInclusao",
    "dataAberturaProposta",
    "dataEncerramentoProposta",
    "dataPublicacaoPncp",
    "dataAtualizacaoGlobal",
)

_NUMERIC_FIELDS = (
    "valorTotalEstimado",
    "valorTotalHomologado",
    "valorTotalSigiloso",
)

_DATE_FORMATS = (
    "%Y-%m-%dT%H:%M:%S",
    "%Y-%m-%dT%H:%M:%S.%f",
    "%Y-%m-%d",
)


def _parse_date(value: str | None) -> datetime | None:
    """Converte string para datetime UTC."""
    if not value:
        return None

    for fmt in _DATE_FORMATS:
        try:
            dt = datetime.strptime(value, fmt)
            return dt.replace(tzinfo=timezone.utc)
        except ValueError:
            continue

    logger.warning("Formato de data não reconhecido: '%s'", value)
    return None


def _parse_decimal(value: Any) -> float | None:
    """Converte valores monetarios da API para float ou None."""
    if value is None or value == "":
        return None

    if isinstance(value, bool):
        return None

    if isinstance(value, (int, float)):
        return float(value)

    if isinstance(value, str):
        raw_value = value.strip()
        normalized = (
            raw_value.replace(".", "").replace(",", ".")
            if "," in raw_value
            else raw_value
        )

        try:
            return float(Decimal(normalized))
        except (InvalidOperation, ValueError):
            logger.warning("Valor numerico nao reconhecido: '%s'", value)
            return None

    return None


def _clean_dict(data: dict[str, Any]) -> dict[str, Any]:
    """
    Remove valores inválidos do dicionário:
    - None
    - strings vazias
    - listas vazias
    """
    return {
        k: v
        for k, v in data.items()
        if v is not None and v != "" and v != []
    }


class PNCPTransformer(BaseTransformer):
    """
    Transforma registros brutos da API do PNCP em documentos limpos para o MongoDB.

    Operações:
    - Conversão de datas
    - Normalização de texto
    - Limpeza de dados
    - Definição de chave única (_id)
    - Enriquecimento com regra de negócio (_mei_compativel)
    """

    def transform(self, record: dict[str, Any]) -> dict[str, Any]:
        """
        Transforma um registro bruto.

        Args:
            record (dict): Registro vindo da API.

        Returns:
            dict: Documento pronto para o MongoDB.
        """

        doc = dict(record)

        # 1. Converter datas
        for field in _DATE_FIELDS:
            if field in doc:
                doc[field] = _parse_date(doc[field])

        # 1.1 Converter valores monetarios
        for field in _NUMERIC_FIELDS:
            if field in doc:
                doc[field] = _parse_decimal(doc[field])

        # 2. Normalização de texto
        text_fields = (
            "objetoCompra",
            "informacaoComplementar",
            "justificativaPresencial",
        )

        for field in text_fields:
            if isinstance(doc.get(field), str):
                doc[field] = doc[field].strip()

        # 3. Normalização do órgão
        orgao = doc.get("orgaoEntidade")
        if isinstance(orgao, dict):
            orgao["razaoSocial"] = (
                (orgao.get("razaoSocial") or "")
                .strip()
                .upper()
            )

        unidade = doc.get("unidadeOrgao")
        if isinstance(unidade, dict) and isinstance(unidade.get("ufSigla"), str):
            unidade["ufSigla"] = unidade["ufSigla"].strip().upper()

        # 4. Limpeza geral (ANTES da regra de negócio)
        doc = _clean_dict(doc)
        
        # LGPD - remoção de campos sensíveis
        doc = remove_sensitive_fields(doc)
        
        # LGPD - pseudonimização
        if doc.get("cnpj"):
            doc = pseudonymize_field(
                doc,
                "cnpj"
            )
        # 5. Regra de negócio: MEI compatível
        valor = doc.get("valorTotalEstimado")

        doc["_mei_compativel"] = (
            isinstance(valor, (int, float)) and valor <= 144_900.0
        )

        # 6. Garantir _id
        numero_controle = doc.get("numeroControlePNCP")
        if not numero_controle:
            raise ValueError("Registro sem numeroControlePNCP")

        doc["_id"] = numero_controle

        # 7. Metadata ETL
        doc["_etl_ingestao_em"] = datetime.now(tz=timezone.utc)
        doc["_etl_fonte"] = "PNCP"
        doc["_etl_camada"] = "silver"

        doc["_consulta"] = {
            "orgao": (orgao or {}).get("razaoSocial") if isinstance(orgao, dict) else None,
            "modalidade": doc.get("modalidadeNome"),
            "uf": (unidade or {}).get("ufSigla") if isinstance(unidade, dict) else None,
            "municipio": (unidade or {}).get("municipioNome") if isinstance(unidade, dict) else None,
            "situacao": doc.get("situacaoCompraNome"),
            "data_publicacao": doc.get("dataPublicacaoPncp"),
            "valor_estimado": doc.get("valorTotalEstimado"),
        }

        return doc

    def transform_batch(
        self, records: list[dict[str, Any]]
    ) -> list[dict[str, Any]]:
        """
        Transforma lista de registros.

        Args:
            records (list): Registros brutos.

        Returns:
            list: Registros transformados.
        """

        transformed = []

        for idx, record in enumerate(records):
            try:
                transformed.append(self.transform(record))
            except Exception:
                logger.exception(
                    "Erro ao transformar registro %d (numeroControlePNCP=%s)",
                    idx,
                    record.get("numeroControlePNCP", "desconhecido"),
                )

        return transformed
