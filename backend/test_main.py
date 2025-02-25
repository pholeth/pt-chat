import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from api.dependencies import get_db
from main import app
from models.base import Base
from models.room import Room

# async driver for Sqlite in memory
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"
engine = create_async_engine(TEST_DATABASE_URL, echo=False)

# Use an async session factory
async_session_maker = sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)


# Fixture for creating and dropping tables for every test run
@pytest_asyncio.fixture(scope="function")
async def setup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture(scope="function")
async def session():
    async with async_session_maker() as session:
        yield session


# This fixture calls to reset the DB and setup the oevrrides the DB connection
@pytest_asyncio.fixture(scope="function")
async def async_client(setup_db, session):
    async def override_get_db():
        yield session

    # Fast Api uses this for test DB
    app.dependency_overrides[get_db] = override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client


async def req_create_user(name: str, async_client: AsyncClient):
    data = dict(name=name)
    response = await async_client.post("/user/", json=data)
    assert response.status_code == 200
    return response.json()


@pytest.mark.asyncio
async def test_create_user_and_jwt(async_client: AsyncClient):
    data = dict(name="Test user")
    response = await async_client.post("/user/", json=data)

    json = response.json()
    assert response.status_code == 200
    assert json["name"] == "Test user"

    access_token = json["access_token"]
    me_response = await async_client.get(
        "/user/me", headers={"Authorization": f"Bearer {access_token}"}
    )
    me_json = response.json()

    assert me_response.status_code == 200
    assert me_json["name"] == "Test user"


@pytest.mark.asyncio
async def test_create_room(async_client: AsyncClient, session: AsyncSession):
    response = await req_create_user("TestUser", async_client)
    access_token = response["access_token"]
    user_id = response["id"]
    headers = {"Authorization": f"Bearer {access_token}"}

    response = await async_client.post(
        "/room/", json=dict(name="MyRoom"), headers=headers
    )

    assert response.status_code == 200

    json = response.json()
    assert json["name"] == "MyRoom"

    # ensure the room's creator is correct
    room = await session.get(Room, int(json["id"]))
    assert room.user_id == user_id


@pytest.mark.asyncio
async def test_list_rooms(async_client: AsyncClient, session: AsyncSession):
    response = await req_create_user("TestUser", async_client)
    access_token = response["access_token"]
    user_id = response["id"]
    headers = {"Authorization": f"Bearer {access_token}"}

    await async_client.post("/room/", json=dict(name="MyRoom1"), headers=headers)
    await async_client.post("/room/", json=dict(name="MyRoom2"), headers=headers)

    rooms_response = await async_client.get("/room/list", headers=headers)
    assert rooms_response.status_code == 200

    rooms_json = rooms_response.json()
    assert len(rooms_json["rooms"]) == 2
