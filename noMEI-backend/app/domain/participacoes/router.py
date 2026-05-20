from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from .schemas import DashboardResponse
from .service import ParticipacaoService

router = APIRouter()
participacao_service = ParticipacaoService()


@router.get("/dashboard", response_model=DashboardResponse,)
async def get_dashboard(current_user: dict = Depends(get_current_user)):
    """
    RF05 - Dashboard de histórico de participações.
    """
    return await participacao_service.resumo_dashboard(user_id=current_user)
