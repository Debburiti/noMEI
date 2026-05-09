from pydantic import BaseModel, EmailStr, ConfigDict, Field

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class RefreshRequest(BaseModel):
    refresh_token: str

class UserResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    id: str = Field(..., alias="_id")
    email: EmailStr
    is_active: bool