import logging
from typing import AsyncGenerator

import redis.asyncio as redis
import strawberry
from fastapi import Depends, FastAPI, Request, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from strawberry.fastapi import GraphQLRouter
from strawberry.subscriptions import GRAPHQL_TRANSPORT_WS_PROTOCOL, GRAPHQL_WS_PROTOCOL

from api.graphql.mutations import Mutation
from api.graphql.queries import Query
from api.graphql.subscriptions import Subscription
from api.routes import room, user
from config import settings
from db.session import async_session_maker
from models.base import Base

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

redis_client = redis.Redis(
    host=settings.redis_host, port=settings.redis_port, decode_responses=True
)

app = FastAPI()


# Dependency to get the database session (required by FastApi)
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session


# Custom FastApi context
class Context:
    def __init__(
        self, session: AsyncSession, access_token: str, redis_client: redis.Redis
    ):
        self.session = session
        self.access_token = access_token
        self.redis_client = redis_client


# Context dependency function
async def get_context(
    request: Request = None,
    websocket: WebSocket = None,
    session: AsyncSession = Depends(get_db),
) -> Context:
    context = {
        "session": session,
        "redis_client": redis_client,
    }

    if request:
        context["access_token"] = request.headers.get("Authorization", "")
    elif websocket:
        context["access_token"] = websocket.headers.get("Authorization", "")

    return context


# Enable CORS if needed
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

schema = strawberry.Schema(query=Query, mutation=Mutation, subscription=Subscription)
graphql_app = GraphQLRouter(
    schema,
    subscription_protocols=[GRAPHQL_TRANSPORT_WS_PROTOCOL, GRAPHQL_WS_PROTOCOL],
    context_getter=get_context,
)
app.include_router(graphql_app, prefix="/graphql")

app.include_router(user.router, prefix="/user")
app.include_router(room.router, prefix="/room")


@app.get("/healthy")
async def health(db: AsyncSession = Depends(get_db)) -> str:
    return "OK"
