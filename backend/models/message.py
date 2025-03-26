from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class Message(Base):
    __tablename__ = "messages"

    content: Mapped[str] = mapped_column(String(1024))

    # Foreign key to the user table
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    user: Mapped["User"] = relationship("User", back_populates="messages")

    # Foreign key to the room table
    room_id: Mapped[int] = mapped_column(ForeignKey("rooms.id"), nullable=False)
    room: Mapped["Room"] = relationship("Room", back_populates="messages")
