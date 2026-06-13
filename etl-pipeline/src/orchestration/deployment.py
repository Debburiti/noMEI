"""
Deployment agendado do flow Prefect.

Uso:
    python -m src.orchestration.deployment

O comando registra/serve o flow com agenda diária. A execução real depende do
Prefect estar configurado no ambiente local ou no Prefect Cloud.
"""

from src.orchestration.orchestrate_prefect import etl_flow


if __name__ == "__main__":
    etl_flow.serve(
        name="etl-pncp-diario",
        cron="0 6 * * *",
        parameters={
            "dias_retroativos": 1,
            "max_paginas": 5,
        },
        tags=["pncp", "etl", "mongodb-atlas"],
    )
