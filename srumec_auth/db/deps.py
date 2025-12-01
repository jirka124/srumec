from sqlalchemy.orm import Session
from db.session import SessionLocal

def get_db():
    """
    Dependency, která poskytuje databázovou session pro jeden request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()