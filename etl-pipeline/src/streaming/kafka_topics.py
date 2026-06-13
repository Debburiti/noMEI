"""
Definição dos tópicos Kafka utilizados pela plataforma.

Responsável por:
- Centralizar os nomes dos tópicos
- Evitar strings mágicas espalhadas pelo código
- Facilitar manutenção e evolução da arquitetura
"""

from config.settings import Settings

TOPIC_PNCP = Settings().KAFKA_TOPIC_PNCP
