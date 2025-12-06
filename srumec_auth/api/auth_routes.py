from fastapi import APIRouter, Depends, status, HTTPException, Request
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from core.config import settings
from schemas import user_schema
from services import auth_service
from db.deps import get_db

router = APIRouter()

@router.post(
    "/register",
    response_model=user_schema.User,
    status_code=status.HTTP_201_CREATED
)
async def create_user(
    user: user_schema.UserCreate,
    db: Session = Depends(get_db)
):
    """
    Endpoint pro registraci nového uživatele.
    - Přijme data odpovídající schématu UserCreate.
    - Zavolá servisní logiku pro vytvoření uživatele.
    - Vrátí data odpovídající schématu User (bez hesla).
    """
    return auth_service.create_user(db=db, user=user)


@router.post("/login", response_model=user_schema.LoginResponse)
async def login_for_access_token(
        user_credentials: user_schema.UserLogin,
        db: Session = Depends(get_db)
):
    """
    Endpoint pro přihlášení uživatele a získání JWT tokenu.
    """
    user = auth_service.authenticate_user(db, user_credentials)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nesprávné přihlašovací údaje",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_payload = {
        "id": str(user.id),
        "role": user.role,
        "name": user.name,
    }
    access_token = auth_service.create_access_token(data=token_payload)

    return {"access_token": access_token, "token_type": "bearer", "user": user}