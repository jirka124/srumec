from uuid import UUID
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# -- Základní společné atributy --
class UserBase(BaseModel):
    email: EmailStr
    name: str

# -- Create (Registrace) --
class UserCreate(UserBase):
    password: str

# -- Update (Co lze měnit) --
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    role: Optional[str] = None
    banned: Optional[bool] = None

# -- Čtení (Response) --
# Toto schéma použijeme pro vracení dat z API (bez hesla)
class UserResponse(UserBase):
    id: UUID
    role: str
    banned: bool     # <-- Nové pole
    created_at: datetime

    class Config:
        from_attributes = True

# -- Login --
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse # <-- Použijeme UserResponse místo User, je to čistší