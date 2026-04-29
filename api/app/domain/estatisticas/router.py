from fastapi import APIRouter

from app.domain.contratacoes.service import ContratacaoService
from app.domain.estatisticas.schemas import EstatisticasResponse

router = APIRouter()
service = ContratacaoService()

@router.get("/", response_model=EstatisticasResponse)
async def obter_estatisticas():
    """
    US-11 — Endpoint de estatísticas para o MEI
    """
    return await service.obter_estatisticas()
