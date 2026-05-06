from enum import Enum

from pydantic import BaseModel


class DocumentoStatus(str, Enum):
    PENDENTE = "pendente"
    VALIDO = "valido"
    EXPIRADO = "expirado"


class DocumentoResponse(BaseModel):
    id: str
    cnpj: str
    nome: str
    tipo: str
    tamanho: int
    status: DocumentoStatus
    data_upload: str


class DocumentoStatusUpdate(BaseModel):
    status: DocumentoStatus


class DocumentoListResponse(BaseModel):
    total: int
    items: list[DocumentoResponse]
