import json
from datetime import datetime
from enum import StrEnum, auto
from typing import AsyncGenerator

import strawberry

from api.graphql.common import get_user_events_channel
from models.user import User

from .schema import MessageType, UserType


class UserAction(StrEnum):
    JOIN = auto()
    LEAVE = auto()


@strawberry.type
class UserEventType:
    user_action: UserAction
    user: UserType


def get_user_action_type(user_action: str) -> UserAction | None:
    return UserAction.__members__.get(user_action.upper())


@strawberry.type
class Subscription:
    @strawberry.subscription
    async def message_created(
        self, info: strawberry.Info, room_id: str
    ) -> AsyncGenerator[MessageType, None]:
        db = info.context.get("session")
        redis = info.context.get("redis_client")
        pubsub = redis.pubsub()
        await pubsub.subscribe(room_id)

        async for message in pubsub.listen():
            if message.get("type") == "message":
                data = json.loads(message.get("data"))
                user = await db.get(User, data.get("user_id"))

                sender = UserType(id=user.id, name=user.name)
                yield MessageType(
                    id=data.get("message_id"),
                    content=data.get("content"),
                    sender=sender,
                    created_at=datetime.fromisoformat(data.get("created_at")),
                )

    @strawberry.subscription
    async def user_event(
        self, info: strawberry.Info, room_id: str
    ) -> AsyncGenerator[UserEventType, None]:
        redis = info.context.get("redis_client")
        pubsub = redis.pubsub()
        channel = get_user_events_channel(room_id)
        await pubsub.subscribe(channel)

        async for message in pubsub.listen():
            print(message)
            if message.get("type") == "message":
                data = json.loads(message.get("data"))

                yield UserEventType(
                    user_action=get_user_action_type(data.get("user_action")),
                    user=UserType(
                        id=int(data.get("user_id")), name=data.get("username")
                    ),
                )
