"""
Módulo Producer Kafka.

Responsável por:
- Publicar mensagens no Apache Kafka
- Serializar registros em JSON
- Enviar dados extraídos da API do PNCP para os tópicos da plataforma

Este módulo implementa a camada de ingestão orientada a eventos,
permitindo desacoplamento entre extração e processamento.
"""

import json

from kafka import KafkaProducer

from config.settings import Settings


class PNCPProducer:
    """
    Producer responsável pelo envio de registros ao Kafka.
    """

    def __init__(
        self,
        bootstrap_servers: str | None = None,
        settings: Settings | None = None,
    ) -> None:
        """
        Inicializa conexão com o broker Kafka.
        """

        settings = settings or Settings()

        self.producer = KafkaProducer(
            bootstrap_servers=bootstrap_servers or settings.KAFKA_BOOTSTRAP_SERVERS,
            value_serializer=lambda value:
            json.dumps(value).encode("utf-8")
        )

    def send(
        self,
        topic: str,
        message: dict
    ) -> None:
        """
        Publica uma mensagem em um tópico.
        """

        self.producer.send(
            topic,
            message
        )

    def flush(self) -> None:
        """
        Força envio das mensagens pendentes.
        """

        self.producer.flush()

    def close(self) -> None:
        """
        Encerra conexão com o broker Kafka.
        """

        self.producer.close()
