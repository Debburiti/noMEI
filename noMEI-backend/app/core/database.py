from motor.motor_asyncio import AsyncIOMotorClient

from app.config import settings


class Database:
    client: AsyncIOMotorClient = None
    db = None

db = Database()

async def connect_to_mongo():
    db.client = AsyncIOMotorClient(settings.mongodb_url)
    db.db = db.client[settings.mongodb_db_name]

async def close_mongo_connection():
    if db.client:
        db.client.close()

def get_database():
    return db.db
