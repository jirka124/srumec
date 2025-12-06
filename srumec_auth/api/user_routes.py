from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from db.deps import get_db
from schemas import user_schema
from models import user_model
from services import user_service
from api.deps import get_current_user, get_current_admin_user  # Naše nová security

router = APIRouter()


# GET /users - Získá všechny uživatele (Např. jen pro admina nebo přihlášené)
@router.get("/", response_model=List[user_schema.UserResponse])
async def read_users(
        skip: int = 0,
        limit: int = 100,
        db: Session = Depends(get_db),
        current_user: user_model.User = Depends(get_current_user)  # Vyžaduje login
):
    return user_service.get_users(db, skip=skip, limit=limit)


# GET /users/{id} - Detail uživatele
@router.get("/{user_id}", response_model=user_schema.UserResponse)
async def read_user(
        user_id: UUID,
        db: Session = Depends(get_db),
        current_user: user_model.User = Depends(get_current_user)
):
    user = user_service.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# PUT /users/{id} - Update (změna jména, role, ban)
@router.put("/{user_id}", response_model=user_schema.UserResponse)
async def update_user(
        user_id: UUID,
        user_update: user_schema.UserUpdate,
        db: Session = Depends(get_db),
        current_user: user_model.User = Depends(get_current_user)
):
    # Logika oprávnění:
    # Admin může měnit kohokoliv. Uživatel jen sám sebe.
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this user")

    # Pokud uživatel není admin, nesmí si měnit roli ani ban status
    if current_user.role != "admin":
        if user_update.role is not None or user_update.banned is not None:
            raise HTTPException(status_code=403, detail="Cannot change role or ban status")

    db_user = user_service.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return user_service.update_user(db, db_user, user_update)


# DELETE /users/{id} - Smazání (Jen Admin)
@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
        user_id: UUID,
        db: Session = Depends(get_db),
        current_user: user_model.User = Depends(get_current_admin_user)  # Jen Admin
):
    db_user = user_service.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    user_service.delete_user(db, db_user)
    return None