from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from core.config import settings

from models import user_model
from schemas import user_schema

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Ověří, zda se zadané heslo shoduje s hashem v databázi."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    password = password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
    return pwd_context.hash(password)


def authenticate_user(db: Session, user_credentials: user_schema.UserLogin) -> user_model.User | None:
    """Ověří přihlašovací údaje uživatele."""
    user = db.query(user_model.User).filter(user_model.User.email == user_credentials.email).first()
    if not user:
        return None  # Uživatel neexistuje
    if not verify_password(user_credentials.password, user.hashed_password):
        return None  # Heslo je nesprávné
    return user

def create_access_token(data: dict) -> str:
    """Vytvoří JWT access token."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt

def create_user(db: Session, user: user_schema.UserCreate):
    """
    Vytvoří nového uživatele v databázi.

    Args:
        db: Databázová session.
        user: Data nového uživatele (z Pydantic schématu).

    Returns:
        Vytvořený uživatelský objekt (z SQLAlchemy modelu).
    """
    db_user = db.query(user_model.User).filter(user_model.User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uživatel s tímto emailem již existuje."
        )

    hashed_password = get_password_hash(user.password)

    db_user = user_model.User(
        email=user.email.__str__(),
        hashed_password=hashed_password,
        name=user.name
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user