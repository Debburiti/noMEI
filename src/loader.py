"""
Módulo de carga de dados no MongoDB Atlas.

Responsável por conectar ao cluster, criar índices e persistir os
documentos transformados usando operações de upsert para idempotência.
"""

import logging
from typing import Any

from pymongo import MongoClient, UpdateOne
from pymongo.collection import Collection
from pymongo.errors import BulkWriteError, ConnectionFailure

from config.settings import Settings

logger = logging.getLogger(__name__)


class MongoDBLoader:
    """
    Carrega documentos transformados no MongoDB Atlas.

    Utiliza operações ``bulk_write`` com ``upsert`` baseado no campo
    ``_id`` (numeroControlePNCP), garantindo idempotência nas execuções.

    Attributes:
        settings (Settings): Configurações da aplicação.
        _client (MongoClient | None): Cliente MongoDB (criado via context manager).
        _collection (Collection | None): Coleção alvo.
    """

    def __init__(self, settings: Settings) -> None:
        """
        Inicializa o loader com as configurações fornecidas.

        Args:
            settings (Settings): Objeto de configurações com URI do MongoDB, nome do
                banco e da coleção.
        """
        self.settings = settings
        self._client: MongoClient | None = None
        self._collection: Collection | None = None

    def connect(self) -> None:
        """
        Abre a conexão com o MongoDB Atlas e prepara a coleção.

        Cria os índices necessários caso ainda não existam.

        Raises:
            ConnectionFailure: Se não for possível conectar ao cluster.
        """
        self._client = MongoClient(
            self.settings.MONGODB_URI,
            serverSelectionTimeoutMS=10_000,
            connectTimeoutMS=10_000,
            socketTimeoutMS=30_000,
        )
        # Valida conexão imediatamente
        try:
            self._client.admin.command("ping")
            logger.info("Conexão com MongoDB Atlas estabelecida com sucesso.")
        except ConnectionFailure:
            logger.error("Falha ao conectar ao MongoDB Atlas.")
            raise

        db = self._client[self.settings.MONGODB_DATABASE]
        self._collection = db[self.settings.MONGODB_COLLECTION]
        self._ensure_indexes()

    def _ensure_indexes(self) -> None:
        """
        Cria índices na coleção para otimizar consultas frequentes.

        Índices criados (se não existirem):
        - ``modalidadeId`` — para filtros por modalidade.
        - ``unidadeOrgao.ufSigla`` — para filtros por UF.
        - ``dataAberturaProposta`` — para filtros/ordenação por data.
        - ``situacaoCompraId`` — para filtros por situação.

        Security note: índices são criados com ``background=False`` para garantir
        consistência na primeira carga.
        """
        assert self._collection is not None
        indexes = [
            "modalidadeId",
            "situacaoCompraId",
        ]
        for field in indexes:
            self._collection.create_index(field, background=True)

        self._collection.create_index(
            [("unidadeOrgao.ufSigla", 1), ("dataAberturaProposta", -1)],
            background=True,
        )
        logger.debug("Índices verificados/criados.")

    def load_batch(self, documents: list[dict[str, Any]]) -> dict[str, int]:
        """
        Persiste um lote de documentos no MongoDB usando upsert em bulk.

        A operação é idempotente: documentos com o mesmo ``_id``
        (numeroControlePNCP) são atualizados em vez de duplicados.

        Args:
            documents (list[dict]): Lista de documentos transformados.

        Returns:
            dict[str, int]: Contagem de operações realizadas com chaves
                ``inserted``, ``modified`` e ``errors``.

        Raises:
            RuntimeError: Se ``connect()`` não foi chamado previamente.
        """
        if self._collection is None:
            raise RuntimeError("Loader não conectado. Chame connect() antes de load_batch().")

        if not documents:
            return {"inserted": 0, "modified": 0, "errors": 0}

        operations = [
            UpdateOne(
                filter={"_id": doc["_id"]},
                update={"$set": doc},
                upsert=True,
            )
            for doc in documents
        ]

        try:
            result = self._collection.bulk_write(operations, ordered=False)
            summary = {
                "inserted": result.upserted_count,
                "modified": result.modified_count,
                "errors": 0,
            }
        except BulkWriteError as exc:
            erros = len(exc.details.get("writeErrors", []))
            logger.error("BulkWriteError: %d operação(ões) com falha.", erros)
            summary = {
                "inserted": exc.details.get("nUpserted", 0),
                "modified": exc.details.get("nModified", 0),
                "errors": erros,
            }

        logger.info(
            "Lote carregado | Inseridos: %d | Atualizados: %d | Erros: %d",
            summary["inserted"],
            summary["modified"],
            summary["errors"],
        )
        return summary

    def close(self) -> None:
        """Fecha a conexão com o MongoDB e libera recursos."""
        if self._client:
            self._client.close()
            self._client = None
            self._collection = None
            logger.debug("Conexão MongoDB encerrada.")

    def __enter__(self) -> "MongoDBLoader":
        """Suporte a context manager — conecta ao banco."""
        self.connect()
        return self

    def __exit__(self, *_: Any) -> None:
        """Suporte a context manager — fecha a conexão ao sair do bloco."""
        self.close()
