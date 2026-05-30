import pandas as pd
import streamlit as st
from pathlib import Path

st.set_page_config(
    page_title="noMEI Analytics",
    page_icon="📊",
)

st.title("📊 noMEI Analytics")
st.write("Consulta dos dados analíticos da camada Gold")


def load_csv(dataset_name: str):
    """
    Carrega CSV da camada Gold.
    """

    csv_files = list(
        Path(
            f"analytics_output/gold/{dataset_name}/csv"
        ).glob("*.csv")
    )

    if not csv_files:
        return None

    return pd.read_csv(csv_files[0])


opcao = st.selectbox(
    "Selecione uma consulta",
    [
        "Oportunidades por UF",
        "Oportunidades MEI",
        "Média por Modalidade",
        "Top Órgãos",
        "Maiores Editais",
        "Maior Valor por UF",
    ]
)

if opcao == "Oportunidades por UF":

    df = load_csv("oportunidades_por_uf")

    st.subheader("Oportunidades por UF")
    st.dataframe(df)

elif opcao == "Oportunidades MEI":

    df = load_csv("oportunidades_mei")

    st.subheader("Oportunidades MEI")
    st.dataframe(df)

elif opcao == "Média por Modalidade":

    df = load_csv("media_por_modalidade")

    st.subheader("Média por Modalidade")
    st.dataframe(df)

elif opcao == "Top Órgãos":

    df = load_csv("top_orgaos")

    st.subheader("Top Órgãos")
    st.dataframe(df)

elif opcao == "Maiores Editais":

    df = load_csv("maiores_editais")

    st.subheader("Maiores Editais")
    st.dataframe(df)

elif opcao == "Maior Valor por UF":

    df = load_csv("maior_valor_por_uf")

    st.subheader("Maior Valor por UF")
    st.dataframe(df)