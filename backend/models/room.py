from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String
from .base import Base

class Room(Base):
    __tablename__ = 'rooms'

    name: Mapped[str ]= mapped_column(String(255), unique=True)

    messages: Mapped[list["Message"]] = relationship("Message", back_populates="room", cascade="all, delete-orphan")


