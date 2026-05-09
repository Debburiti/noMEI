from fastapi import APIRouter

from app.domain.alertas.router import router as alertas_router
from app.domain.contratacoes.router import router as contratacoes_router
from app.domain.documentos.router import router as documentos_router
from app.domain.estatisticas.router import router as estatisticas_router
from app.domain.perfil.router import router as perfil_router
from app.domain.qualificacao.router import router as qualificacao_router
from app.domain.auth.router import router as auth_router

router = APIRouter()

router.include_router(contratacoes_router, prefix="/licitacoes", tags=["Contratações"])
router.include_router(estatisticas_router, prefix="/estatisticas", tags=["Estatísticas"])
router.include_router(perfil_router, prefix="/perfil", tags=["Perfil do MEI"])
router.include_router(alertas_router, prefix="/alertas", tags=["Alertas"])
router.include_router(qualificacao_router, prefix="/qualificacao", tags=["Qualificação"])
router.include_router(documentos_router, prefix="/documentos", tags=["Documentos"])
router.include_router(auth_router, prefix="/auth", tags=["Auth"])