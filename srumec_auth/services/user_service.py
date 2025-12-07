from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Optional
from models import user_model
from schemas import user_schema


def get_user(db: Session, user_id: UUID) -> Optional[user_model.User]:
    return db.query(user_model.User).filter(user_model.User.id == user_id).first()


def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[user_model.User]:
    return db.query(user_model.User).offset(skip).limit(limit).all()


def update_user(db: Session, db_user: user_model.User, user_update: user_schema.UserUpdate) -> user_model.User:
    # Převedeme Pydantic model na dict, vynecháme None hodnoty
    update_data = user_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_user, key, value)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, db_user: user_model.User):
    db.delete(db_user)
    db.commit()