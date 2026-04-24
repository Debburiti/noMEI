from fastapi import APIRouter

from app.schemas.estatistica import EstatisticasResponse
from app.services.contratacao_service import ContratacaoService

router = APIRouter()
service = ContratacaoService()

@router.get("/", response_model=EstatisticasResponse)
async def obter_estatisticas():
    """
    US-11 — Endpoint de estatísticas para o MEI
    """
    return await service.obter_estatisticas()
