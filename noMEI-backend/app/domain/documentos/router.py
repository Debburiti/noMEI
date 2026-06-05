from fastapi import APIRouter, Depends, Query, UploadFile, File, Form
from fastapi.responses import Response

from app.core.dependencies import get_current_user
from app.domain.documentos.schemas import (
    DocumentoListResponse,
    DocumentoResponse,
    DocumentoStatusUpdate,
)
from app.domain.documentos.service import DocumentoService

router = APIRouter()
service = DocumentoService()


@router.post("/", response_model=DocumentoResponse, status_code=201)
async def upload_documento(
    cnpj: str = Form(..., description="CNPJ do MEI"),
    file: UploadFile = File(..., description="Arquivo do documento"),
    _: str = Depends(get_current_user),
):
    conteudo = await file.read()
    return await service.upload(
        cnpj=cnpj,
        nome=file.filename,
        tipo=file.content_type or "application/octet-stream",
        conteudo=conteudo,
    )


@router.get("/", response_model=DocumentoListResponse)
async def listar_documentos(
    cnpj: str = Query(..., description="CNPJ do MEI"),
    _: str = Depends(get_current_user),
):
    return await service.listar(cnpj)


@router.get("/{id}/download")
async def download_documento(id: str, _: str = Depends(get_current_user)):
    conteudo, nome, tipo = await service.download(id)
    return Response(
        content=conteudo,
        media_type=tipo,
        headers={"Content-Disposition": f'attachment; filename="{nome}"'},
    )


@router.patch("/{id}", response_model=DocumentoResponse)
async def atualizar_status(
    id: str,
    body: DocumentoStatusUpdate,
    _: str = Depends(get_current_user),
):
    return await service.atualizar_status(id, body.status)


@router.delete("/{id}", status_code=204)
async def remover_documento(id: str, _: str = Depends(get_current_user)):
    await service.remover(id)
