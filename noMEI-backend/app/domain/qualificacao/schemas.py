from pydantic import BaseModel


class QualificacaoRequest(BaseModel):
    cnpj: str
    numero_controle_pncp: str


class ChecklistItem(BaseModel):
    item: str
    elegivel: bool
    detalhe: str


class QualificacaoResponse(BaseModel):
    elegivel: bool
    itens: list[ChecklistItem]
