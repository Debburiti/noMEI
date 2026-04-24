from fastapi import APIRouter

from app.api.v1.endpoints import contratacoes, estatisticas, perfil

router = APIRouter()

router.include_router(contratacoes.router, prefix="/contratacoes", tags=["Contratações"])
router.include_router(estatisticas.router, prefix="/estatisticas", tags=["Estatísticas"])
router.include_router(perfil.router, prefix="/perfil", tags=["Perfil do MEI"])
