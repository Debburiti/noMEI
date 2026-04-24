
from pydantic import BaseModel, Field


class PerfilBase(BaseModel):
    cnpj: str = Field(..., description="CNPJ do MEI")
    cnae: str | None = None
    uf: str | None = None
    cidade: str | None = None
    palavras_chave: list[str] = []
    notificacoes: bool = True

class PerfilCreate(PerfilBase):
    pass

class PerfilResponse(PerfilBase):
    id: str = Field(..., alias="_id")

    class Config:
        populate_by_name = True
