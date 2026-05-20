from typing import Literal
from fastapi import HTTPException
from .repository import ParticipacaoRepository
from .schemas import DashboardResponse
from app.domain.auth.repository import UserRepository

BidStatus = Literal["open", "analysis", "sent", "winner", "closed"]

class ParticipacaoService:
    def __init__(self):
        self.repository = ParticipacaoRepository()
        self.user_repository = UserRepository()
        self.status_finalizados: set[BidStatus] = {"winner", "closed"}


    def _extrair_total_participacoes(self, raw_data: dict) -> int:
        total_participacoes_data = raw_data.get("total_participacoes", [])
        return total_participacoes_data[0]["total"] if total_participacoes_data else 0
        
    def _calcular_taxa_vitoria(self, resumo_status: list[dict]) -> float:
        total_vitorias = 0
        total_finalizadas = 0

        for item in resumo_status:
            status_atual = item.get("status")
            quantidade = item.get("total", 0)

            if status_atual == "winner":
                total_vitorias = quantidade
            
            if status_atual in self.status_finalizados:
                total_finalizadas += quantidade

        return (total_vitorias / total_finalizadas) if total_finalizadas > 0 else 0.0
        

    async def resumo_dashboard(self, user_id: str) -> DashboardResponse:
        
        user = await self.user_repository.get_user_by_id(user_id)

        if not user or not user.get("cnpj"):
            raise HTTPException(status_code=404, detail="Usuário não possui CNPJ cadastrado.")
        
        cnpj = user.get("cnpj")
        raw_data = await self.repository.get_dashboard_resumo(cnpj=cnpj)

        total_participacoes = self._extrair_total_participacoes(raw_data)

        resumo_status = raw_data.get("resumo_status", [])

        taxa_vitoria = self._calcular_taxa_vitoria(resumo_status)

        return DashboardResponse(
            total_participacoes=total_participacoes,
            taxa_vitoria=taxa_vitoria,
            resumo_status=resumo_status,
        )