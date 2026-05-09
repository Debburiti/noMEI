from datetime import UTC, datetime
from pydantic import BaseModel, EmailStr, Field

class UserDocument(BaseModel):
    """Representa o documento salvo no MongoDB"""
    email: EmailStr
    password_hash: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    is_active: bool = True