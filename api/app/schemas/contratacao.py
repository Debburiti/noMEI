from datetime import datetime

from pydantic import BaseModel


class ContratacaoBase(BaseModel):
    numeroControlePNCP: str
    orgaoEntidade: dict
    dataPublicacaoPncp: datetime | None = None
    dataEncerramentoProposta: datetime | None = None
    objetoCompra: str | None = None
    valorTotalEstimado: float | None = None
    uf: str | None = None
    modalidadeId: int | None = None
    modalidadeNome: str | None = None
    meiCompativel: bool = False
    motivoIncompatibilidade: str | None = None
    # Adicionar outros campos da integração conforme necessário

class ContratacaoResponse(ContratacaoBase):
    pass

class ContratacaoListResponse(BaseModel):
    total: int
    page: int
    pages: int
    items: list[ContratacaoResponse]
