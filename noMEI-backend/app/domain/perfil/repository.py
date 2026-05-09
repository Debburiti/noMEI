from typing import Any

from bson import ObjectId
from bson.errors import InvalidId

from app.core.database import get_database


class PerfilRepository:
    @property
    def collection(self):
        return get_database()["perfis_mei"]

    async def get_by_id(self, id: str) -> dict[Any, Any] | None:
        try:
            doc = await self.collection.find_one({"_id": ObjectId(id)})
            if doc:
                doc["_id"] = str(doc["_id"])
            return doc
        except InvalidId:
            return None

    async def get_by_cnpj(self, cnpj: str) -> dict[Any, Any] | None:
        doc = await self.collection.find_one({"cnpj": cnpj})
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def get_by_user_id(self, user_id: str) -> dict[Any, Any] | None:
        doc = await self.collection.find_one({"user_id": user_id})
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def create_or_update(
        self, perfil_data: dict[Any, Any], user_id: str
    ) -> dict[Any, Any]:
        perfil_data["user_id"] = user_id

        cnpj = perfil_data.get("cnpj")
        existing = await self.get_by_cnpj(cnpj)

        if existing:
            await self.collection.update_one({"cnpj": cnpj}, {"$set": perfil_data})
            return await self.get_by_cnpj(cnpj)
        else:
            result = await self.collection.insert_one(perfil_data)
            return await self.get_by_id(str(result.inserted_id))