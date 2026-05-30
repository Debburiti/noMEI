"""
Servidor MCP para consulta da camada Gold do projeto noMEI.

Responsável por:
- Expor ferramentas MCP para consulta dos dados analíticos
- Consumir os CSVs gerados pelo PySpark
- Disponibilizar informações para chatbots e aplicações externas

Camada consultada:
Gold Layer (analytics_output/gold)
"""

from pathlib import Path

import pandas as pd
from fastmcp import FastMCP

mcp = FastMCP("noMEI Analytics")


def load_csv(dataset_name: str) -> pd.DataFrame:
    """
    Carrega automaticamente o CSV de um dataset da camada Gold.

    Args:
        dataset_name (str): Nome do dataset.

    Returns:
        pd.DataFrame: DataFrame carregado.
    """

    csv_files = list(
        Path(
            f"analytics_output/gold/{dataset_name}/csv"
        ).glob("*.csv")
    )

    if not csv_files:
        raise FileNotFoundError(
            f"Nenhum CSV encontrado para o dataset '{dataset_name}'"
        )

    return pd.read_csv(csv_files[0])


@mcp.tool()
def oportunidades_por_uf():
    """
    Retorna a quantidade de oportunidades agrupadas por UF.
    """

    df = load_csv("oportunidades_por_uf")

    return df.to_dict(orient="records")


@mcp.tool()
def oportunidades_mei():
    """
    Retorna oportunidades compatíveis com MEI por UF.
    """

    df = load_csv("oportunidades_mei")

    return df.to_dict(orient="records")


@mcp.tool()
def media_por_modalidade():
    """
    Retorna a média de valor estimado por modalidade.
    """

    df = load_csv("media_por_modalidade")

    return df.to_dict(orient="records")


@mcp.tool()
def top_orgaos():
    """
    Retorna os órgãos com maior número de oportunidades.
    """

    df = load_csv("top_orgaos")

    return df.to_dict(orient="records")


@mcp.tool()
def maiores_editais():
    """
    Retorna os editais com maiores valores estimados.
    """

    df = load_csv("maiores_editais")

    return df.to_dict(orient="records")


@mcp.tool()
def maior_valor_por_uf():
    """
    Retorna o maior valor estimado encontrado por UF.
    """

    df = load_csv("maior_valor_por_uf")

    return df.to_dict(orient="records")


if __name__ == "__main__":
    print("Iniciando MCP Server do noMEI...")

    mcp.run()