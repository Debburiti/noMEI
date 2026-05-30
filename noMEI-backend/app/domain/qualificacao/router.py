from fastapi import APIRouter

from app.domain.qualificacao.schemas import QualificacaoRequest, QualificacaoResponse
from app.domain.qualificacao.service import QualificacaoService

router = APIRouter()
service = QualificacaoService()


@router.post("/verificar", response_model=QualificacaoResponse)
async def verificar_elegibilidade(request: QualificacaoRequest):
    """
    Verifica a elegibilidade do MEI para uma licitação específica.
    Retorna um checklist de critérios com status e detalhes.
    """
    return await service.verificar_elegibilidade(
        cnpj=request.cnpj,
        numero_controle_pncp=request.numero_controle_pncp,
    )
