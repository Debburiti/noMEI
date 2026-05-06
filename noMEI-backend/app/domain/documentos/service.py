from typing import Any

from app.core.exceptions import NotFoundError
from app.domain.documentos.repository import DocumentoRepository
from app.domain.documentos.schemas import DocumentoStatus


class DocumentoService:
    def __init__(self):
        self.repository = DocumentoRepository()

    async def upload(
        self, cnpj: str, nome: str, tipo: str, conteudo: bytes
    ) -> dict[str, Any]:
        return await self.repository.salvar(cnpj, nome, tipo, conteudo)

    async def listar(self, cnpj: str) -> dict[str, Any]:
        items = await self.repository.listar_por_cnpj(cnpj)
        return {"total": len(items), "items": items}

    async def download(self, id: str) -> tuple[bytes, str, str]:
        result = await self.repository.download(id)
        if not result:
            raise NotFoundError("Documento não encontrado")
        return result

    async def atualizar_status(self, id: str, status: DocumentoStatus) -> dict[str, Any]:
        doc = await self.repository.atualizar_status(id, status)
        if not doc:
            raise NotFoundError("Documento não encontrado")
        return doc

    async def remover(self, id: str) -> None:
        removed = await self.repository.remover(id)
        if not removed:
            raise NotFoundError("Documento não encontrado")
