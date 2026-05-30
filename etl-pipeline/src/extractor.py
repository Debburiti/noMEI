"""
Módulo de extração de dados da API pública do PNCP.

Responsável por realizar requisições HTTP paginadas ao endpoint
/v1/contratacoes/proposta e retornar os registros brutos enriquecidos.
"""

import logging
import time
from datetime import datetime, timedelta
from typing import Any, Generator

import requests

from config.settings import Settings

logger = logging.getLogger(__name__)


class PNCPExtractor:
    _ENDPOINT = "/v1/contratacoes/proposta"

    def __init__(self, settings: Settings) -> None:
        self.settings = settings

        self.session = requests.Session()
        self.session.headers.update({
            "Accept": "application/json",
            "User-Agent": "etl-pncp/1.0"
        })

        self._cache_itens: dict[str, list[dict]] = {}

    def _fetch_page(self, params: dict[str, Any]) -> dict[str, Any]:
        url = self.settings.BASE_URL + self._ENDPOINT

        for attempt in range(1, self.settings.MAX_RETRIES + 1):
            try:
                start_time = time.time()

                response = self.session.get(
                    url,
                    params=params,
                    timeout=(5, self.settings.REQUEST_TIMEOUT),
                )

                duration = time.time() - start_time
                logger.info("Request concluída em %.2fs", duration)

                if response.status_code == 422:
                    logger.error(
                        "Erro 422 | Params: %s | Response: %s",
                        params,
                        response.text[:200],
                    )
                    return {"data": [], "totalRegistros": 0}

                response.raise_for_status()
                return response.json()

            except requests.HTTPError as exc:
                status = exc.response.status_code if exc.response else None

                if status and 400 <= status < 500:
                    logger.error(
                        "Erro de cliente %s | Params: %s",
                        status,
                        params,
                    )
                    return {"data": [], "totalRegistros": 0}

                if attempt < self.settings.MAX_RETRIES:
                    wait = self.settings.RETRY_BACKOFF * (2 ** (attempt - 1))
                    logger.warning(
                        "Tentativa %d/%d falhou (HTTP %s). Aguardando %.1fs...",
                        attempt,
                        self.settings.MAX_RETRIES,
                        status,
                        wait,
                    )
                    time.sleep(wait)
                else:
                    logger.error("Falha definitiva após erro HTTP: %s", status)
                    raise

            except requests.RequestException as exc:
                if attempt < self.settings.MAX_RETRIES:
                    wait = self.settings.RETRY_BACKOFF * (2 ** (attempt - 1))
                    logger.warning(
                        "Tentativa %d/%d falhou (%s). Aguardando %.1fs...",
                        attempt,
                        self.settings.MAX_RETRIES,
                        str(exc),
                        wait,
                    )
                    time.sleep(wait)
                else:
                    logger.error(
                        "Falha definitiva ao acessar API do PNCP: %s",
                        str(exc),
                    )
                    raise

        return {"data": [], "totalRegistros": 0}

    def _fetch_itens(self, cnpj: str, ano: int, sequencial: int) -> list[dict]:
        """
        Busca itens do edital com cache + retry inteligente.
        """

        cache_key = f"{cnpj}-{ano}-{sequencial}"

        if cache_key in self._cache_itens:
            return self._cache_itens[cache_key]

        url = f"{self.settings.BASE_URL}/v1/orgaos/{cnpj}/compras/{ano}/{sequencial}/itens"

        for attempt in range(1, self.settings.MAX_RETRIES + 1):
            try:
                response = self.session.get(
                    url,
                    timeout=(3, self.settings.REQUEST_TIMEOUT),
                )
                response.raise_for_status()

                data = response.json().get("data", [])

                self._cache_itens[cache_key] = data
                return data

            except requests.HTTPError as exc:
                status = exc.response.status_code if exc.response else None

                if status == 404:
                    logger.debug("Itens não encontrados (404) para %s", cache_key)
                    self._cache_itens[cache_key] = []
                    return []

                if attempt < self.settings.MAX_RETRIES:
                    wait = self.settings.RETRY_BACKOFF * (2 ** (attempt - 1))
                    logger.warning(
                        "Erro HTTP %s ao buscar itens. Retry em %.1fs...",
                        status,
                        wait,
                    )
                    time.sleep(wait)
                else:
                    logger.warning("Falha ao buscar itens para %s", cache_key)
                    self._cache_itens[cache_key] = []
                    return []

            except requests.RequestException as exc:
                if attempt < self.settings.MAX_RETRIES:
                    wait = self.settings.RETRY_BACKOFF * (2 ** (attempt - 1))
                    logger.warning(
                        "Erro ao buscar itens (%s). Retry em %.1fs...",
                        str(exc),
                        wait,
                    )
                    time.sleep(wait)
                else:
                    logger.warning("Falha ao buscar itens para %s", cache_key)
                    self._cache_itens[cache_key] = []
                    return []

    def extract(
        self,
        data_final: str,
        data_inicial: str | None = None,
        uf: str | list[str] | None = None,
        codigo_modalidade: int | None = None,
        cnpj: str | None = None,
        codigo_municipio_ibge: str | None = None,
        codigo_unidade_administrativa: str | None = None,
        max_paginas: int | None = None,
        page_size: int | None = None,
    ) -> Generator[dict[str, Any], None, None]:

        page_size = page_size or self.settings.PAGE_SIZE

        logger.info(
            "Configuração: page_size=%s | max_paginas=%s",
            page_size,
            max_paginas or "ilimitado",
        )

        if not data_inicial:
            fallback = datetime.now() - timedelta(days=2)
            data_inicial = fallback.strftime("%Y%m%d")

        params: dict[str, Any] = {
            "dataFinal": data_final,
            "dataInicial": data_inicial,
            "pagina": 1,
            "tamanhoPagina": page_size,
        }

        if uf:
            params["uf"] = ",".join(uf) if isinstance(uf, list) else uf

        if codigo_modalidade is not None:
            params["codigoModalidadeContratacao"] = codigo_modalidade

        if cnpj:
            params["cnpj"] = cnpj

        if codigo_municipio_ibge:
            params["codigoMunicipioIbge"] = codigo_municipio_ibge

        if codigo_unidade_administrativa:
            params["codigoUnidadeAdministrativa"] = codigo_unidade_administrativa

        total_extraido = 0

        while True:
            logger.info("Buscando página %d...", params["pagina"])

            payload = self._fetch_page(params)
            records = payload.get("data", [])

            if not records:
                break

            for record in records:
                try:
                    orgao = record.get("orgaoEntidade", {})
                    cnpj = orgao.get("cnpj")
                    ano = record.get("anoCompra")
                    sequencial = record.get("sequencialCompra")

                    cnae_codes = set()

                    if cnpj and ano and sequencial:
                        itens = self._fetch_itens(cnpj, ano, sequencial)

                        for item in itens:
                            cnae = item.get("codigoCnae")
                            if cnae:
                                cnae_codes.add(cnae)

                    record["cnae_codes"] = list(cnae_codes)

                except Exception:
                    logger.warning(
                        "Erro ao enriquecer CNAE para %s",
                        record.get("numeroControlePNCP"),
                    )
                    record["cnae_codes"] = []

                yield record

            total_extraido += len(records)

            if max_paginas and params["pagina"] >= max_paginas:
                logger.warning("Limite de páginas atingido (%d).", max_paginas)
                break

            params["pagina"] += 1

        logger.info("Total de registros extraídos: %d", total_extraido)

    def close(self) -> None:
        self.session.close()
        logger.debug("Sessão HTTP encerrada.")