import strawberry
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import contains_eager

from models.message import Message
from models.user import User

from .common import get_room_users_prefix
from .schema import MessageType, UserType


@strawberry.type
class Query:
    @staticmethod
    def to_message_type(message: Message) -> MessageType:
        sender = UserType(id=message.user.id, name=message.user.name)
        return MessageType(
            id=message.id,
            content=message.content,
            sender=sender,
            created_at=message.created_at,
        )

    @strawberry.field
    async def get_messages_by_room(
        self, info: strawberry.Info, room_id: strawberry.ID
    ) -> list[MessageType]:
        db: AsyncSession = info.context["session"]
        results = await db.execute(
            select(Message)
            .join(Message.user)
            .where(Message.room_id == int(room_id))
            .options(
                contains_eager(Message.user)
            )  # this way we can get the user info in the same query without
            # the async IO problem
        )

        return map(Query.to_message_type, results.scalars().all())

    @strawberry.field
    async def get_room_users(
        self, info: strawberry.Info, room_id: strawberry.ID
    ) -> list[UserType]:
        """
        Query to get the users joined the room

        Args:
            room_id (ID) the room ID

        Returns:
            The list of users joined the room
        """
        db: AsyncSession = info.context["session"]
        redis = info.context.get("redis_client")

        key_prefix = get_room_users_prefix(room_id)
        keys = await redis.keys(f"{key_prefix}*")
        user_ids = [int(k.split("::").pop()) for k in keys]

        stmt = select(User.id, User.name).where(User.id.in_(user_ids))
        results = await db.execute(stmt)
        users = results.all()

        return [UserType(id=id, name=name) for id, name in users]
