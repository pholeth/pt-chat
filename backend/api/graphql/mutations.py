import functools
import json
import logging
from datetime import datetime
from typing import Callable

import strawberry
from fastapi import HTTPException
from graphql import GraphQLError
from sqlalchemy.ext.asyncio import AsyncSession

from api.dependencies import verify_token
from api.graphql.subscriptions import UserAction
from consts import ACCESS_TOKEN_EXPIRE_MINUTES
from models.message import Message
from models.room import Room
from models.user import User

from .common import get_room_users_key, get_user_events_channel
from .schema import RoomType


@strawberry.type
class CreateMessageType:
    id: int
    content: str
    created_at: datetime
    room: RoomType


@strawberry.type
class CreateMessageErrorType:
    error: str


@strawberry.type
class OperationType:
    success: bool


def requires_auth(func: Callable) -> Callable:
    """Decorator to enforce authentication on specific queries or mutations."""

    @functools.wraps(func)
    def wrapper(self, info: strawberry.Info, *args, **kwargs):
        access_token = info.context.get("access_token")

        if not access_token:
            raise HTTPException(status_code=401)

        user_id = verify_token(access_token)
        info.context["user_id"] = user_id
        return func(self, info, *args, **kwargs)

    return wrapper


@strawberry.type
class Mutation:
    @strawberry.mutation
    @requires_auth
    async def create_message(
        self, info: strawberry.Info, room_id: strawberry.ID, content: str
    ) -> CreateMessageType:
        db: AsyncSession = info.context["session"]
        user_id: int = info.context["user_id"]
        redis = info.context.get("redis_client")

        room = await db.get(Room, int(room_id))
        if room is None:
            return CreateMessageErrorType(error=f"Room {room_id} not found")

        message = Message(content=content, room_id=room.id, user_id=user_id)
        db.add(message)
        await db.commit()

        if redis:
            data = dict(
                message_id=message.id,
                content=content,
                room_id=room_id,
                user_id=user_id,
                created_at=message.created_at.isoformat(),
            )

            logging.info(f"Publishing new message to room {room_id}")
            await redis.publish(str(room_id), json.dumps(data))

        return CreateMessageType(
            id=message.id,
            content=message.content,
            room=RoomType(name=room.name, id=room.id),
            created_at=datetime.now(),
        )

    @strawberry.mutation
    @requires_auth
    async def join_room(
        self, info: strawberry.Info, room_id: strawberry.ID
    ) -> OperationType:
        """
        Mutation to user join room

        Args:
            room_id (int) the room ID

        Returns:
            The result of joining room
        """
        db: AsyncSession = info.context["session"]
        redis = info.context.get("redis_client")
        user_id: int = info.context["user_id"]
        user = await db.get(User, user_id)

        if user is None:
            raise GraphQLError("User not found")

        key = get_room_users_key(room_id, user_id)
        await redis.set(
            key, datetime.now().isoformat(), ex=ACCESS_TOKEN_EXPIRE_MINUTES * 1000
        )

        data = dict(user_id=user_id, username=user.name, user_action=UserAction.JOIN)
        await redis.publish(get_user_events_channel(room_id), json.dumps(data))

        return OperationType(success=True)

    @strawberry.mutation
    @requires_auth
    async def leave_room(
        self, info: strawberry.Info, room_id: strawberry.ID
    ) -> OperationType:
        """
        Mutation to leave the room

        Args:
            room_id (int) the room ID

        Returns:
            The result of joining room
        """
        db: AsyncSession = info.context["session"]
        redis = info.context.get("redis_client")
        user_id: int = info.context["user_id"]
        user = await db.get(User, user_id)

        if user is None:
            raise GraphQLError("User not found")

        key = get_room_users_key(room_id, user_id)
        if await redis.keys(key):
            await redis.delete(key)

            data = dict(
                user_id=user_id, username=user.name, user_action=UserAction.LEAVE
            )
            await redis.publish(get_user_events_channel(room_id), json.dumps(data))

        return OperationType(success=True)
