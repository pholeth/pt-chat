from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import DateTime, Integer, func
from sqlalchemy.orm import DeclarativeBase

# Declarative Base Setup
class Base(DeclarativeBase):
    __abstract__ = True  # Prevents SQLAlchemy from creating a table for this class

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

