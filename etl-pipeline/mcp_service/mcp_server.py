"""Servidor MCP para consulta dos dados curados do noMEI."""

from datetime import datetime, time, timezone
from typing import Any

from fastmcp import FastMCP
from pymongo import MongoClient

from config.settings import Settings

# ==========================================================
# CONFIGURAÇÃO
# ==========================================================

settings = Settings()

client = MongoClient(
    settings.MONGODB_URI
)

db = client[
    settings.MONGODB_DATABASE
]

collection = db[
    settings.MONGODB_COLLECTION
]

mcp = FastMCP(
    "noMEI MCP Server"
)


def _parse_date(date_value: str, end_of_day: bool = False) -> datetime:
    parsed = datetime.fromisoformat(date_value)

    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)

    if end_of_day:
        parsed = datetime.combine(parsed.date(), time.max, tzinfo=parsed.tzinfo)

    return parsed


def _build_query(
    uf: str | None = None,
    orgao: str | None = None,
    modalidade: str | None = None,
    data_inicio: str | None = None,
    data_fim: str | None = None,
    termo_objeto: str | None = None,
    mei_compativel: bool | None = None,
) -> dict[str, Any]:
    query: dict[str, Any] = {}

    if uf:
        query["unidadeOrgao.ufSigla"] = uf.upper()

    if orgao:
        query["orgaoEntidade.razaoSocial"] = {
            "$regex": orgao,
            "$options": "i",
        }

    if modalidade:
        query["modalidadeNome"] = {
            "$regex": modalidade,
            "$options": "i",
        }

    if data_inicio or data_fim:
        periodo: dict[str, datetime] = {}

        if data_inicio:
            periodo["$gte"] = _parse_date(data_inicio)

        if data_fim:
            periodo["$lte"] = _parse_date(data_fim, end_of_day=True)

        query["dataPublicacaoPncp"] = periodo

    if termo_objeto:
        query["objetoCompra"] = {
            "$regex": termo_objeto,
            "$options": "i",
        }

    if mei_compativel is not None:
        query["_mei_compativel"] = mei_compativel

    return query


def _projection() -> dict[str, int]:
    return {
        "_id": 0,
        "numeroControlePNCP": 1,
        "orgaoEntidade.razaoSocial": 1,
        "modalidadeNome": 1,
        "objetoCompra": 1,
        "valorTotalEstimado": 1,
        "valorTotalHomologado": 1,
        "unidadeOrgao.ufSigla": 1,
        "unidadeOrgao.municipioNome": 1,
        "situacaoCompraNome": 1,
        "dataPublicacaoPncp": 1,
        "_etl_ingestao_em": 1,
        "_mei_compativel": 1,
    }

# ==========================================================
# CONSULTAS OPERACIONAIS
# ==========================================================


@mcp.tool()
def consultar_por_uf(
    uf: str
):
    """
    Retorna oportunidades por UF.
    """

    documentos = list(
        collection.find(
            {
                "unidadeOrgao.ufSigla": uf.upper()
            },
            {
                "_id": 0
            }
        ).limit(20)
    )

    return documentos


@mcp.tool()
def consultar_por_modalidade(
    modalidade: str
):
    """
    Retorna oportunidades por modalidade.
    """

    documentos = list(
        collection.find(
            {
                "modalidadeNome": modalidade
            },
            {
                "_id": 0
            }
        ).limit(20)
    )

    return documentos


@mcp.tool()
def consultar_por_orgao(
    orgao: str
):
    """
    Retorna oportunidades por órgão.
    """

    documentos = list(
        collection.find(
            {
                "orgaoEntidade.razaoSocial": {
                    "$regex": orgao,
                    "$options": "i",
                }
            },
            {
                "_id": 0
            }
        ).limit(20)
    )

    return documentos


@mcp.tool()
def consultar_mei():
    """
    Retorna oportunidades compatíveis com MEI.
    """

    documentos = list(
        collection.find(
            {
                "_mei_compativel": True
            },
            {
                "_id": 0
            }
        ).limit(20)
    )

    return documentos


# ==========================================================
# CONSULTAS POR PERÍODO
# ==========================================================


@mcp.tool()
def consultar_por_periodo(
    data_inicio: str,
    data_fim: str,
):
    """
    Consulta oportunidades por período.

    Formato:
        YYYY-MM-DD
    """

    inicio = _parse_date(data_inicio)

    fim = _parse_date(data_fim, end_of_day=True)

    documentos = list(
        collection.find(
            {
                "dataPublicacaoPncp": {
                    "$gte": inicio,
                    "$lte": fim,
                }
            },
            {
                "_id": 0
            }
        ).limit(50)
    )

    return documentos


@mcp.tool()
def consultar_contratacoes(
    uf: str | None = None,
    orgao: str | None = None,
    modalidade: str | None = None,
    data_inicio: str | None = None,
    data_fim: str | None = None,
    termo_objeto: str | None = None,
    mei_compativel: bool | None = None,
    limite: int = 20,
):
    """
    Consulta parametrizada sobre a camada Silver.

    Permite combinar UF, órgão, modalidade, período de publicação,
    termo no objeto e compatibilidade MEI.
    Datas devem usar o formato YYYY-MM-DD.
    """

    query = _build_query(
        uf=uf,
        orgao=orgao,
        modalidade=modalidade,
        data_inicio=data_inicio,
        data_fim=data_fim,
        termo_objeto=termo_objeto,
        mei_compativel=mei_compativel,
    )

    documentos = list(
        collection.find(
            query,
            _projection(),
        )
        .sort("dataPublicacaoPncp", -1)
        .limit(min(max(limite, 1), 100))
    )

    return {
        "filtros": query,
        "total_retornado": len(documentos),
        "documentos": documentos,
    }


@mcp.tool()
def valor_total_contratacoes(
    uf: str | None = None,
    orgao: str | None = None,
    modalidade: str | None = None,
    data_inicio: str | None = None,
    data_fim: str | None = None,
    termo_objeto: str | None = None,
    mei_compativel: bool | None = None,
):
    """
    Agrega quantidade e valor total estimado para filtros combinados.

    Exemplo de uso em linguagem natural:
    "qual o valor total das licitações de TI publicadas em Pernambuco
    no último trimestre?"
    """

    query = _build_query(
        uf=uf,
        orgao=orgao,
        modalidade=modalidade,
        data_inicio=data_inicio,
        data_fim=data_fim,
        termo_objeto=termo_objeto,
        mei_compativel=mei_compativel,
    )

    pipeline = [
        {"$match": query},
        {
            "$group": {
                "_id": None,
                "quantidade": {"$sum": 1},
                "valor_total_estimado": {"$sum": "$valorTotalEstimado"},
                "valor_medio_estimado": {"$avg": "$valorTotalEstimado"},
            }
        },
        {
            "$project": {
                "_id": 0,
                "quantidade": 1,
                "valor_total_estimado": 1,
                "valor_medio_estimado": 1,
            }
        },
    ]

    resultado = list(collection.aggregate(pipeline))

    return {
        "filtros": query,
        "resultado": resultado[0] if resultado else {
            "quantidade": 0,
            "valor_total_estimado": 0,
            "valor_medio_estimado": 0,
        },
    }


@mcp.resource("pncp://resumo")
def recurso_resumo_base():
    """Recurso MCP com resumo operacional da base curada."""

    return resumo_geral()


# ==========================================================
# CONSULTAS ANALÍTICAS
# ==========================================================


@mcp.tool()
def valor_total_por_uf(
    uf: str
):
    """
    Retorna o valor total estimado das oportunidades de uma UF.
    """

    pipeline = [
        {
            "$match": {
                "unidadeOrgao.ufSigla": uf.upper()
            }
        },
        {
            "$group": {
                "_id": "$unidadeOrgao.ufSigla",
                "quantidade": {
                    "$sum": 1
                },
                "valor_total": {
                    "$sum": "$valorTotalEstimado"
                },
            }
        }
    ]

    resultado = list(
        collection.aggregate(
            pipeline
        )
    )

    return resultado


@mcp.tool()
def valor_total_mei():
    """
    Retorna o valor total das oportunidades compatíveis com MEI.
    """

    pipeline = [
        {
            "$match": {
                "_mei_compativel": True
            }
        },
        {
            "$group": {
                "_id": "MEI",
                "quantidade": {
                    "$sum": 1
                },
                "valor_total": {
                    "$sum": "$valorTotalEstimado"
                },
            }
        }
    ]

    resultado = list(
        collection.aggregate(
            pipeline
        )
    )

    return resultado


@mcp.tool()
def resumo_geral():
    """
    Retorna estatísticas gerais da base.
    """

    total_registros = collection.count_documents(
        {}
    )

    total_mei = collection.count_documents(
        {
            "_mei_compativel": True
        }
    )

    pipeline = [
        {
            "$group": {
                "_id": None,
                "valor_total": {
                    "$sum": "$valorTotalEstimado"
                }
            }
        }
    ]

    resultado = list(
        collection.aggregate(
            pipeline
        )
    )

    valor_total = (
        resultado[0]["valor_total"]
        if resultado
        else 0
    )

    return {
        "total_registros": total_registros,
        "total_oportunidades_mei": total_mei,
        "valor_total_estimado": valor_total,
    }


# ==========================================================
# START SERVER
# ==========================================================

if __name__ == "__main__":

    print(
        "Iniciando MCP Server do noMEI..."
    )

    mcp.run()
