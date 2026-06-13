"""
Módulo Consumer Kafka.

Responsável por:
- Consumir mensagens dos tópicos Kafka
- Desserializar mensagens JSON
- Disponibilizar registros para processamento downstream

Este módulo implementa a camada de consumo da arquitetura orientada
a eventos da plataforma.
"""

import json
import logging

from kafka import KafkaConsumer

from config.settings import Settings

logger = logging.getLogger(__name__)


class PNCPConsumer:
    """
    Consumer responsável pela leitura de registros do Kafka.
    """

    def __init__(
        self,
        topic: str,
        bootstrap_servers: str | None = None,
        group_id: str | None = None,
        settings: Settings | None = None,
    ) -> None:
        """
        Inicializa consumidor Kafka.
        """

        settings = settings or Settings()

        self.consumer = KafkaConsumer(
            topic,
            bootstrap_servers=bootstrap_servers or settings.KAFKA_BOOTSTRAP_SERVERS,
            group_id=group_id or settings.KAFKA_GROUP_ID,
            auto_offset_reset="earliest",
            enable_auto_commit=True,
            value_deserializer=lambda message: json.loads(message.decode("utf-8")),
        )

        logger.info(
            "Consumer conectado ao tópico %s",
            topic,
        )

    def consume(self):
        """
        Consome mensagens continuamente.
        """
        print("CONSUMER INICIADO")

        for message in self.consumer:

            print("MENSAGEM BRUTA:")
            print(message)

            print("VALOR:")
            print(message.value)

            yield message.value
