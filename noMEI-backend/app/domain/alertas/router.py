from fastapi import APIRouter, Depends, HTTPException, status

from app.core.dependencies import get_current_user
from app.domain.alertas.schemas import AlertaListResponse, GerarAlertasResponse
from app.domain.alertas.service import AlertaService

router = APIRouter()
service = AlertaService()


@router.get("/", response_model=AlertaListResponse)
async def listar_alertas(user_id: str = Depends(get_current_user)):
    return await service.listar(user_id)


@router.post("/gerar", response_model=GerarAlertasResponse, status_code=status.HTTP_200_OK)
async def gerar_alertas(user_id: str = Depends(get_current_user)):
    return await service.gerar(user_id)


@router.patch("/{alerta_id}/read", status_code=status.HTTP_204_NO_CONTENT)
async def marcar_como_lido(alerta_id: str, user_id: str = Depends(get_current_user)):
    updated = await service.marcar_como_lido(alerta_id, user_id)
    if not updated:
        raise HTTPException(status_code=404, detail="Alerta não encontrado")


@router.patch("/read-all", status_code=status.HTTP_204_NO_CONTENT)
async def marcar_todos_como_lidos(user_id: str = Depends(get_current_user)):
    await service.marcar_todos_como_lidos(user_id)
