from datetime import datetime
from pydantic import BaseModel, EmailStr

class UserDocument(BaseModel):
    """Representa o documento salvo no MongoDB"""
    email: EmailStr
    password_hash: str
    created_at: datetime = datetime.utcnow()
    is_active: bool = True