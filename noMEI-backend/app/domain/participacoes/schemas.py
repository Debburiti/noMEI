from pydantic import BaseModel, Field
from typing import Optional

class StatusResumo(BaseModel):
    status: str = Field(..., description="Status da proposta.")
    total: int = Field(..., description="Total de participações com este status.")
    processos_ids: list[str] = Field(default_factory=list, description="Lista de IDs dos processos que possuem este status.")


class DashboardResponse(BaseModel):
    total_participacoes: int = Field(..., description="Número total de participações do usuário.")
    taxa_vitoria: float = Field(..., description="Percentual de propostas vencidas em relação ao total.")
    resumo_status: list[StatusResumo] = Field(..., description="Lista com o resumo de participações por status.")

class ParticipacaoListItem(BaseModel):
    id: str = Field(..., description="ID único da participação.")
    titulo: Optional[str] = Field(None, description="Título do processo licitatório.")
    data_abertura: Optional[str] = Field(None, description="Data de abertura do processo.")
    valor_estimado: Optional[float] = Field(None, description="Valor estimado do processo.")
    status_proposta: Optional[str] = Field(None, description="Status atual da proposta.")
    cnpj: Optional[str] = Field(None, description="CNPJ do participante.")

class ParticipacaoListResponse(BaseModel):
    total: int = Field(..., description="Total de registros retornados.")
    items: list[ParticipacaoListItem] = Field(...)