from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class Room(Base):
    __tablename__ = "rooms"

    name: Mapped[str] = mapped_column(String(255), unique=True)

    # Foreign key to the user table
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    user: Mapped["User"] = relationship("User")

    messages: Mapped[list["Message"]] = relationship(
        "Message", back_populates="room", cascade="all, delete-orphan"
    )
