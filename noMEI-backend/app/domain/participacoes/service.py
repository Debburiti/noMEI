from typing import Literal, Optional
from fastapi import HTTPException
from .repository import ParticipacaoRepository
from .schemas import DashboardResponse, ParticipacaoListResponse, ParticipacaoListItem
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
        
    async def _validar_e_extrair_cnpj(self, user_id: str) -> str:
        user = await self.user_repository.get_user_by_id(user_id)

        if not user or not user.get("cnpj"):
            raise HTTPException(
                status_code=404, detail="Usuário não possui CNPJ cadastrado."
            )
        return user["cnpj"]


    async def resumo_dashboard(self, user_id: str) -> DashboardResponse:
        
        cnpj = await self._validar_e_extrair_cnpj(user_id)
        raw_data = await self.repository.get_dashboard_resumo(cnpj=cnpj)
        total_participacoes = self._extrair_total_participacoes(raw_data)
        resumo_status = raw_data.get("resumo_status", [])
        taxa_vitoria = self._calcular_taxa_vitoria(resumo_status)

        return DashboardResponse(
            total_participacoes=total_participacoes,
            taxa_vitoria=taxa_vitoria,
            resumo_status=resumo_status,
        )
    
    async def listar_participacoes(self, user_id: str, status: Optional[str] = None
    ) -> ParticipacaoListResponse:
        cnpj = await self._validar_e_extrair_cnpj(user_id)
        raw_items = await self.repository.list_by_cnpj(cnpj=cnpj, status=status)

        items = [
            ParticipacaoListItem(
                id=str(doc.get("_id", "")),
                titulo=doc.get("titulo"),
                data_abertura=str(doc["data_abertura"]) if doc.get("data_abertura") else None,
                valor_estimado=doc.get("valor_estimado"),
                status_proposta=doc.get("status_proposta"),
                cnpj=doc.get("cnpj"),
            )
            for doc in raw_items
        ]

        return ParticipacaoListResponse(total=len(items), items=items)