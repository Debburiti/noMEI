import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.api.v1.router import router as api_router
from app.config import settings
from app.core.database import close_mongo_connection, connect_to_mongo
from app.core.exceptions import AppException
from app.core.middleware import logging_middleware, register_middlewares

logging.basicConfig(
    level=logging.DEBUG if settings.app_debug else logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)

TAGS_METADATA = [
    {"name": "Health", "description": "Status da aplicação"},
    {"name": "Contratações", "description": "Listagem e detalhe de licitações do PNCP (US-09, US-10)"},
    {"name": "Estatísticas", "description": "Painel de estatísticas para o MEI (US-11)"},
    {"name": "Perfil do MEI", "description": "Gestão de perfil e preferências (US-12)"},
    {"name": "Alertas", "description": "Alertas e notificações do MEI (Sprint 3)"},
    {"name": "Qualificação", "description": "Checklist de elegibilidade do MEI para licitações"},
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.getLogger("noMEI_api").info("🚀 Iniciando conexão com MongoDB...")
    await connect_to_mongo()
    yield
    logging.getLogger("noMEI_api").info("🛑 Encerrando conexão com MongoDB...")
    await close_mongo_connection()

def create_app() -> FastAPI:
    app = FastAPI(
        title="noMEI API Backend",
        version="1.0.0",
        description="API Backend para o app Expo do MEI.",
        debug=settings.app_debug,
        lifespan=lifespan,
        openapi_tags=TAGS_METADATA,
        docs_url="/docs" if not settings.is_production else None,
        redoc_url="/redoc" if not settings.is_production else None,
        openapi_url="/openapi.json" if not settings.is_production else None,
    )

    register_middlewares(app)
    app.middleware("http")(logging_middleware)

    # Inclusão das novas rotas em camadas
    app.include_router(api_router, prefix="/api")

    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        return JSONResponse(
            status_code=exc.code,
            content={"detail": exc.message},
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        first_error = exc.errors()[0]
        field = " → ".join(str(loc) for loc in first_error["loc"] if loc != "body")
        message = f"{field}: {first_error['msg']}" if field else first_error["msg"]
        return JSONResponse(
            status_code=422,
            content={"detail": message},
        )

    @app.get("/health", tags=["Health"])
    async def health_check():
        return {"status": "ok", "env": settings.app_env, "database": "mongodb"}

    return app

app = create_app()
