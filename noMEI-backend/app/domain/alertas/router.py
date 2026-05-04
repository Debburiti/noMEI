from fastapi import APIRouter

from app.domain.alertas.schemas import AlertaListResponse

router = APIRouter()


@router.get("/", response_model=AlertaListResponse)
async def listar_alertas():
    """
    Alertas e notificações do MEI — integração completa na Sprint 3
    """
    return {"total": 0, "items": []}
