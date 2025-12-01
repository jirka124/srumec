from pydantic import BaseModel, EmailStr
from datetime import datetime

# -- Základní schéma s atributy, které jsou společné --
class UserBase(BaseModel):
    email: EmailStr  # EmailStr automaticky validuje, že jde o platný email


# -- Schéma pro vytváření uživatele--
class UserCreate(UserBase):
    password: str


# -- Schéma pro čtení uživatele --
class User(UserBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# --- Schémata pro login a token ---
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
