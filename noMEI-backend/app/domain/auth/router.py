from fastapi import APIRouter, HTTPException, status
from app.domain.auth.schemas import UserCreate, UserLogin, TokenResponse, RefreshRequest
from app.domain.auth.service import AuthService

router = APIRouter()
service = AuthService()

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(body: UserCreate):
    try:
        return await service.registrar(body.email, body.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=TokenResponse)
async def login(body: UserLogin):
    try:
        return await service.autenticar(body.email, body.password)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/refresh", response_model=TokenResponse)
async def refresh(body: RefreshRequest):
    try:
        return await service.renovar_token(body.refresh_token)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))