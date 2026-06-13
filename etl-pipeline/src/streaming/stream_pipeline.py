"""
Pipeline de Streaming Kafka.

Responsável por:
- Consumir mensagens Kafka
- Transformar registros recebidos
- Persistir dados no MongoDB
- Registrar eventos de auditoria
- Processar dados em tempo real
"""

import logging

from config.settings import Settings

from src.processing.transformer import PNCPTransformer
from src.storage.loader import MongoDBLoader

from src.streaming.kafka_consumer import PNCPConsumer
from src.streaming.kafka_topics import TOPIC_PNCP

from src.security.audit import log_event

logger = logging.getLogger(__name__)


def run_stream_pipeline() -> None:
    """
    Executa pipeline de processamento streaming.
    """

    print("\n=== STREAM PIPELINE INICIADO ===\n")

    settings = Settings()

    consumer = PNCPConsumer(
        TOPIC_PNCP
    )

    transformer = PNCPTransformer()

    loader = MongoDBLoader(
        settings
    )

    log_event(
        "stream_pipeline_started",
        {
            "topic": TOPIC_PNCP
        }
    )

    try:

        with loader:

            print("MongoDB conectado.")
            print("Aguardando mensagens...\n")

            for message in consumer.consume():

                print("=" * 60)
                print("MENSAGEM RECEBIDA")
                print(message)

                try:

                    document = transformer.transform(
                        message
                    )

                    print("\nDOCUMENTO TRANSFORMADO:")
                    print(document)

                    summary = loader.load_batch(
                        [document]
                    )

                    print("\nLOAD EXECUTADO:")
                    print(summary)

                    logger.info(
                        "Registro processado: %s",
                        document["_id"]
                    )

                    log_event(
                        "stream_record_processed",
                        {
                            "id": document["_id"],
                            "inserted": summary["inserted"],
                            "modified": summary["modified"],
                        }
                    )

                except Exception as exc:

                    print("\nERRO AO PROCESSAR REGISTRO")
                    print(type(exc))
                    print(exc)

                    logger.exception(
                        "Erro ao processar mensagem: %s",
                        exc
                    )

                    log_event(
                        "stream_processing_error",
                        {
                            "error": str(exc),
                            "message": str(message)[:500],
                        }
                    )

    except Exception as exc:

        print("\nERRO CRÍTICO")
        print(type(exc))
        print(exc)

        logger.exception(
            "Erro crítico no Stream Pipeline: %s",
            exc
        )

        log_event(
            "stream_pipeline_error",
            {
                "error": str(exc)
            }
        )

    finally:

        try:
            consumer.consumer.close()
        except Exception:
            pass

        log_event(
            "stream_pipeline_finished",
            {
                "topic": TOPIC_PNCP
            }
        )

        print("\n=== STREAM PIPELINE FINALIZADO ===")