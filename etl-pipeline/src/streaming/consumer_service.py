"""
Serviço de consumo Kafka.

Responsável por:
- Consumir mensagens Kafka
- Executar transformação dos registros
- Persistir dados no MongoDB

Este serviço implementa a camada de processamento orientada a eventos.
"""

from config.settings import Settings

from src.processing.transformer import PNCPTransformer
from src.storage.loader import MongoDBLoader

from src.streaming.kafka_consumer import PNCPConsumer
from src.streaming.kafka_topics import TOPIC_PNCP


def run_consumer() -> None:
    """
    Executa consumo contínuo de mensagens Kafka.
    """

    settings = Settings()

    transformer = PNCPTransformer()
    loader = MongoDBLoader(settings)

    consumer = PNCPConsumer(
        TOPIC_PNCP
    )

    with loader:

        for message in consumer.consume():

            try:

                document = transformer.transform(
                    message
                )

                loader.load_batch(
                    [document]
                )

            except Exception as exc:

                print(
                    f"Erro ao processar mensagem: {exc}"
                )