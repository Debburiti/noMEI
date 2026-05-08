from datetime import datetime
from app.core.security import hash_password, verify_password, create_tokens
from app.domain.auth.repository import UserRepository

class AuthService:
    def __init__(self):
        self.repository = UserRepository()

    async def registrar(self, email: str, password: str) -> dict:
        if await self.repository.get_by_email(email):
            raise ValueError("Email já cadastrado")

        user_data = {
            "email": email,
            "password_hash": hash_password(password),
            "created_at": datetime.utcnow(),
            "is_active": True,
        }
        user = await self.repository.create(user_data)
        return create_tokens(user["_id"])  # retorna TokenResponse

    async def autenticar(self, email: str, password: str) -> dict:
        user = await self.repository.get_by_email(email)
        if not user or not verify_password(password, user["password_hash"]):
            raise ValueError("Credenciais inválidas")
        return create_tokens(user["_id"])