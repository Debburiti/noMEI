"""Fluxo de ingestão Kafka PNCP -> tópico de eventos."""

from datetime import datetime, timedelta

from config.settings import Settings

from src.ingestion.extractor import PNCPExtractor
from src.ingestion.producer import PNCPProducer

from src.streaming.kafka_topics import TOPIC_PNCP


def run_kafka_flow(
    dias_retroativos: int = 1,
    max_paginas: int = 1,
) -> None:
    """
    Executa fluxo PNCP -> Kafka.
    """

    settings = Settings()

    extractor = PNCPExtractor(
        settings
    )

    producer = PNCPProducer(
        settings=settings
    )

    hoje = datetime.now()
    data_final = hoje.strftime("%Y%m%d")
    data_inicial = (hoje - timedelta(days=dias_retroativos)).strftime("%Y%m%d")

    try:

        for record in extractor.extract(
            data_inicial=data_inicial,
            data_final=data_final,
            max_paginas=max_paginas,
        ):

            producer.send(
                TOPIC_PNCP,
                record,
            )

        producer.flush()

        print(
            "Mensagens enviadas ao Kafka."
        )

    finally:

        producer.close()
