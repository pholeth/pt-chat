from sqlalchemy.orm import Mapped, sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from config import settings

# Database Setup
DATABASE_URL = f"postgresql+asyncpg://{settings.postgres_user}:{settings.postgres_password}@{settings.postgres_host}:{settings.postgres_port}/{settings.db_name}"
async_engine = create_async_engine(DATABASE_URL, echo=True if settings.env == "development" else False)

# Session maker
async_session_maker = sessionmaker(async_engine, class_=AsyncSession, expire_on_commit=False)

