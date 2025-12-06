from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from schemas import user_schema
from services import auth_service
from db.deps import get_db

router = APIRouter()

@router.post(
    "/register",
    response_model=user_schema.UserResponse,  # <--- ZDE BYLA CHYBA (bylo tam .User)
    status_code=status.HTTP_201_CREATED
)
async def create_user(
    user: user_schema.UserCreate,
    db: Session = Depends(get_db)
):
    """
    Endpoint pro registraci nového uživatele.
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

    # Vrátíme user objekt, Pydantic (LoginResponse -> UserResponse) si ho převede
    return {"access_token": access_token, "token_type": "bearer", "user": user}