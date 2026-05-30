from datetime import UTC, datetime
from typing import Any

from bson import ObjectId
from bson.errors import InvalidId
from motor.motor_asyncio import AsyncIOMotorGridFSBucket

from app.core.database import get_database
from app.domain.documentos.schemas import DocumentoStatus


class DocumentoRepository:
    @property
    def _bucket(self) -> AsyncIOMotorGridFSBucket:
        return AsyncIOMotorGridFSBucket(get_database(), bucket_name="documentos_mei")

    async def salvar(
        self, cnpj: str, nome: str, tipo: str, conteudo: bytes
    ) -> dict[str, Any]:
        metadata = {
            "cnpj": cnpj,
            "tipo": tipo,
            "status": DocumentoStatus.PENDENTE,
            "data_upload": datetime.now(UTC).isoformat(),
        }
        file_id = await self._bucket.upload_from_stream(
            nome, conteudo, metadata=metadata
        )
        return await self.get_by_id(str(file_id))

    async def listar_por_cnpj(self, cnpj: str) -> list[dict[str, Any]]:
        cursor = self._bucket.find({"metadata.cnpj": cnpj})
        documentos = []
        async for grid_out in cursor:
            documentos.append(self._serialize(grid_out))
        return documentos

    async def get_by_id(self, id: str) -> dict[str, Any] | None:
        try:
            grid_out = await self._bucket.open_download_stream(ObjectId(id))
            return self._serialize(grid_out)
        except (InvalidId, Exception):
            return None

    async def download(self, id: str) -> tuple[bytes, str, str] | None:
        try:
            grid_out = await self._bucket.open_download_stream(ObjectId(id))
            conteudo = await grid_out.read()
            nome = grid_out.filename
            tipo = grid_out.metadata.get("tipo", "application/octet-stream")
            return conteudo, nome, tipo
        except (InvalidId, Exception):
            return None

    async def atualizar_status(self, id: str, status: DocumentoStatus) -> dict[str, Any] | None:
        try:
            oid = ObjectId(id)
        except InvalidId:
            return None
        await get_database()["documentos_mei.files"].update_one(
            {"_id": oid},
            {"$set": {"metadata.status": status}},
        )
        return await self.get_by_id(id)

    async def remover(self, id: str) -> bool:
        try:
            await self._bucket.delete(ObjectId(id))
            return True
        except (InvalidId, Exception):
            return False

    def _serialize(self, grid_out: Any) -> dict[str, Any]:
        meta = grid_out.metadata or {}
        return {
            "id": str(grid_out._id),
            "cnpj": meta.get("cnpj", ""),
            "nome": grid_out.filename,
            "tipo": meta.get("tipo", ""),
            "tamanho": grid_out.length,
            "status": meta.get("status", DocumentoStatus.PENDENTE),
            "data_upload": meta.get("data_upload", ""),
        }
