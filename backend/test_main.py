from httpx import ASGITransport, AsyncClient
import pytest

import pytest_asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from api.dependencies import get_db
from models.base import Base
from main import app

# async driver for Sqlite in memory
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"
engine = create_async_engine(TEST_DATABASE_URL, echo=True)

# Use an async session factory
async_session_maker = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Fixture for creating and dropping tables for every test run
@pytest_asyncio.fixture(scope="function")
async def setup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

# This fixture calls to reset the DB and setup the oevrrides the DB connection
@pytest_asyncio.fixture(scope="function")
async def async_client(setup_db):
    async def override_get_db():
        async with async_session_maker() as session:
            yield session

    # Fast Api uses this for test DB
    app.dependency_overrides[get_db] = override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url='http://test') as client:
        yield client

@pytest.mark.asyncio
async def test_create_user_and_jwt(async_client: AsyncClient):
    data = dict(name="Test user")
    response = await async_client.post("/user/", json=data)

    json = response.json()
    assert response.status_code == 200
    assert json["name"] == "Test user"

    access_token = json["access_token"]
    me_response = await async_client.get("/user/me", headers={ "Authorization": f"Bearer {access_token}"})
    me_json = response.json()

    assert me_response.status_code == 200
    assert me_json["name"] == "Test user"




