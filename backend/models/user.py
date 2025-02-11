from sqlalchemy.orm import Mapped, mapped_column, relationship, registry
from sqlalchemy import String
from .base import Base

class User(Base):
    __tablename__ = 'users'

    name: Mapped[str ]= mapped_column(String(255), unique=True)

    messages: Mapped[list["Message"]] = relationship("Message", back_populates="user", cascade="all, delete-orphan")

