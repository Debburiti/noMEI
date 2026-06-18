"""
Métricas analíticas da plataforma noMEI.

Responsável por:
- Construir indicadores analíticos
- Gerar KPIs para apoio à decisão
- Produzir datasets da camada Gold
"""

from pyspark.sql import DataFrame
from pyspark.sql.functions import (
    avg,
    col,
    count,
    desc,
    max,
    round,
)


def build_gold_metrics(
    df: DataFrame,
) -> dict[str, DataFrame]:

    oportunidades_por_uf = (
        df.groupBy("unidadeOrgao.ufSigla")
        .agg(
            count("*").alias(
                "total_oportunidades"
            )
        )
        .orderBy(
            desc(
                "total_oportunidades"
            )
        )
    )

    media_por_modalidade = (
        df.groupBy(
            "modalidadeNome"
        )
        .agg(
            round(
                avg(
                    "valorTotalEstimado"
                ),
                2,
            ).alias(
                "media_valor"
            )
        )
        .orderBy(
            desc(
                "media_valor"
            )
        )
    )

    oportunidades_mei = (
        df.filter(
            col(
                "_mei_compativel"
            ) == True
        )
        .groupBy(
            "unidadeOrgao.ufSigla"
        )
        .agg(
            count("*").alias(
                "total_mei"
            )
        )
        .orderBy(
            desc("total_mei")
        )
    )

    top_orgaos = (
        df.groupBy(
            "orgaoEntidade.razaoSocial"
        )
        .agg(
            count("*").alias(
                "total_editais"
            )
        )
        .orderBy(
            desc(
                "total_editais"
            )
        )
    )

    maiores_editais = (
        df.select(
            "objetoCompra",
            "valorTotalEstimado",
            "modalidadeNome",
        )
        .orderBy(
            desc(
                "valorTotalEstimado"
            )
        )
        .limit(10)
    )

    maior_valor_por_uf = (
        df.groupBy(
            "unidadeOrgao.ufSigla"
        )
        .agg(
            max(
                "valorTotalEstimado"
            ).alias(
                "maior_valor"
            )
        )
        .orderBy(
            desc(
                "maior_valor"
            )
        )
    )

    return {
        "oportunidades_por_uf": oportunidades_por_uf,
        "media_por_modalidade": media_por_modalidade,
        "oportunidades_mei": oportunidades_mei,
        "top_orgaos": top_orgaos,
        "maiores_editais": maiores_editais,
        "maior_valor_por_uf": maior_valor_por_uf,
    }