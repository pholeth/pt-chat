from datetime import datetime

import strawberry


# define schema
@strawberry.type
class UserType:
    id: int
    name: str


@strawberry.type
class RoomType:
    id: int
    name: str


@strawberry.type
class MessageType:
    id: int
    content: str
    sender: UserType
    created_at: datetime
