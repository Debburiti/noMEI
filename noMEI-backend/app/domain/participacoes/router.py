from fastapi import APIRouter, Depends, Query
from typing import Optional
from app.core.dependencies import get_current_user
from .schemas import DashboardResponse, ParticipacaoListResponse
from .service import ParticipacaoService

router = APIRouter()
participacao_service = ParticipacaoService()


@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(current_user: str = Depends(get_current_user)):
    """
    RF05 - Dashboard com andamento de propostas.
    """
    return await participacao_service.resumo_dashboard(user_id=current_user)

@router.get("/", response_model=ParticipacaoListResponse)
async def listar_participacoes(user_id: str = Depends(get_current_user),status: Optional[str] = Query(default=None)):
    """
    RF05 - Listar histórico de participações.
    """
    return await participacao_service.listar_participacoes(user_id=user_id, status=status)