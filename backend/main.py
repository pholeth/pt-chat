import asyncio
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase, sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, Integer, String
import strawberry
from strawberry.fastapi import GraphQLRouter
from models.base import Base

from api.routes import user

app = FastAPI()

# define the GQL type
@strawberry.type
class UserType:
    id: int
    name: str
    age: int

# define the query
@strawberry.type
class Query:
    @strawberry.field
    async def get_user_by_id(self, info: strawberry.Info, user_id: int) -> UserType:
        db: AsyncSession = info.context['session']
        user = await db.get(User, user_id)
        return UserType(id=1, name=user.name, age=user.age)

# Dependency to get the database session (required by FastApi)
async def get_db() -> AsyncSession:
    async with async_session_maker() as session:
        yield session

# Custom FastApi context
class Context:
    def __init__(self, session: AsyncSession):
        self.session = session

# Context dependency function
async def get_context(session: AsyncSession = Depends(get_db)) -> Context:
    return {"session": session}

# Enable CORS if needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

schema = strawberry.Schema(query=Query)
graphql_app = GraphQLRouter(schema, context_getter=get_context)
app.include_router(graphql_app, prefix="/graphql")

app.include_router(user.router, prefix="/user")


@app.get("/")
async def root(db: AsyncSession = Depends(get_db)):
    user = User(id=2, name="Second user", age=100)
    db.add(user)
    await db.commit()

    return { "message": "A new user added" }

@app.get("/users")
async def users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    users = result.scalars().all()

    return { "users": users }