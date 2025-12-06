import uuid
from email.policy import default

from sqlalchemy import Column, Integer, String, DateTime, UUID, Boolean
from sqlalchemy.sql import func
from db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    banned = Column(Boolean, nullable=False, default=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False, server_default="user")
    created_at = Column(DateTime(timezone=True), server_default=func.now())