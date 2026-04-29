from typing import Any

from app.domain.perfil.repository import PerfilRepository


class PerfilService:
    def __init__(self):
        self.repository = PerfilRepository()

    async def obter_perfil(self, id: str) -> dict[Any, Any] | None:
        return await self.repository.get_by_id(id)

    async def salvar_perfil(self, perfil_data: dict[Any, Any]) -> dict[Any, Any]:
        return await self.repository.create_or_update(perfil_data)
