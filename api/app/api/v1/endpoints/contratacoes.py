
from fastapi import APIRouter, Query

from app.core.exceptions import NotFoundError
from app.schemas.contratacao import ContratacaoListResponse, ContratacaoResponse
from app.services.contratacao_service import ContratacaoService

router = APIRouter()
service = ContratacaoService()

@router.get("/", response_model=ContratacaoListResponse)
async def listar_contratacoes(
    uf: str | None = Query(None, description="Filtrar por UF"),
    modalidadeId: int | None = Query(None, description="Filtrar por ID da modalidade"),
    valorMax: float | None = Query(None, description="Valor máximo estimado"),
    meiCompativel: bool | None = Query(None, description="Apenas compatíveis com MEI"),
    page: int = Query(1, ge=1, description="Número da página"),
    limit: int = Query(10, ge=1, le=100, description="Quantidade por página")
):
    """
    US-09 — Listar contratações com propostas abertas
    """
    return await service.listar_contratacoes(
        page=page,
        limit=limit,
        uf=uf,
        modalidade_id=modalidadeId,
        valor_max=valorMax,
        mei_compativel=meiCompativel
    )

@router.get("/{numeroControlePNCP}", response_model=ContratacaoResponse)
async def obter_contratacao(numeroControlePNCP: str):
    """
    US-10 — Detalhe de uma contratação
    """
    contratacao = await service.obter_contratacao(numeroControlePNCP)
    if not contratacao:
        raise NotFoundError("Contratação não encontrada")
    return contratacao
