import pandas as pd
import streamlit as st
from pathlib import Path

st.set_page_config(
    page_title="noMEI Analytics",
    page_icon="📊",
)

st.title("📊 noMEI Analytics")
st.write(
    "Visualização da camada Gold gerada pelo PySpark"
)


def load_csv(dataset_name: str):

    csv_files = list(
        Path(
            f"analytics_output/gold/{dataset_name}/csv"
        ).glob("*.csv")
    )

    if not csv_files:
        return None

    return pd.read_csv(csv_files[0])


consulta = st.selectbox(
    "Selecione um dataset",
    [
        "Oportunidades por UF",
        "Oportunidades MEI",
        "Média por Modalidade",
        "Top Órgãos",
        "Maiores Editais",
        "Maior Valor por UF",
    ]
)

if consulta == "Oportunidades por UF":

    df = load_csv(
        "oportunidades_por_uf"
    )

    st.dataframe(df)

elif consulta == "Oportunidades MEI":

    df = load_csv(
        "oportunidades_mei"
    )

    st.dataframe(df)

elif consulta == "Média por Modalidade":

    df = load_csv(
        "media_por_modalidade"
    )

    st.dataframe(df)

elif consulta == "Top Órgãos":

    df = load_csv(
        "top_orgaos"
    )

    st.dataframe(df)

elif consulta == "Maiores Editais":

    df = load_csv(
        "maiores_editais"
    )

    st.dataframe(df)

elif consulta == "Maior Valor por UF":

    df = load_csv(
        "maior_valor_por_uf"
    )

    st.dataframe(df)