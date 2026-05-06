from fastapi import APIRouter, Query, UploadFile, File, Form
from fastapi.responses import Response

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
):
    """RF03 — Upload de documento do MEI"""
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
):
    """RF03 — Listar documentos do MEI"""
    return await service.listar(cnpj)


@router.get("/{id}/download")
async def download_documento(id: str):
    """RF03 — Download de documento"""
    conteudo, nome, tipo = await service.download(id)
    return Response(
        content=conteudo,
        media_type=tipo,
        headers={"Content-Disposition": f'attachment; filename="{nome}"'},
    )


@router.patch("/{id}", response_model=DocumentoResponse)
async def atualizar_status(id: str, body: DocumentoStatusUpdate):
    """RF03 — Atualizar status do documento"""
    return await service.atualizar_status(id, body.status)


@router.delete("/{id}", status_code=204)
async def remover_documento(id: str):
    """RF03 — Remover documento"""
    await service.remover(id)
