from pydantic import BaseModel, Field


class StatusResumo(BaseModel):
    status: str = Field(..., description="Status da proposta.")
    total: int = Field(..., description="Total de participações com este status.")
    processos_ids: list[str] = Field(default_factory=list, description="Lista de IDs dos processos que possuem este status.")


class DashboardResponse(BaseModel):
    total_participacoes: int = Field(..., description="Número total de participações do usuário.")
    taxa_vitoria: float = Field(..., description="Percentual de propostas vencidas em relação ao total.")
    resumo_status: list[StatusResumo] = Field(..., description="Lista com o resumo de participações por status.")
