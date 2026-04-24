from fastapi import APIRouter, HTTPException

from app.schemas.perfil import PerfilCreate, PerfilResponse
from app.services.perfil_service import PerfilService

router = APIRouter()
service = PerfilService()

@router.post("/", response_model=PerfilResponse)
async def criar_ou_atualizar_perfil(perfil: PerfilCreate):
    """
    US-12 — Gestão de perfil do MEI (Criar/Atualizar)
    """
    return await service.salvar_perfil(perfil.model_dump())

@router.get("/{id}", response_model=PerfilResponse)
async def obter_perfil(id: str):
    """
    US-12 — Gestão de perfil do MEI (Ler)
    """
    perfil = await service.obter_perfil(id)
    if not perfil:
        raise HTTPException(status_code=404, detail="Perfil não encontrado")
    return perfil
