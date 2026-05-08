from typing import Any
from bson import ObjectId
from app.core.database import get_database

class UserRepository:
    @property
    def collection(self):
        return get_database()["users"]

    async def get_by_email(self, email: str) -> dict | None:
        doc = await self.collection.find_one({"email": email})
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def get_by_id(self, user_id: str) -> dict | None:
        doc = await self.collection.find_one({"_id": ObjectId(user_id)})
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def create(self, user_data: dict) -> dict:
        result = await self.collection.insert_one(user_data)
        return await self.get_by_id(str(result.inserted_id))