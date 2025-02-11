from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from models.room import Room
from ..dependencies import get_db

class RoomCreate(BaseModel):
    user_id: str # TODO: later will be replaced with JWT
    name: str = Field(max_length=255)

class RoomResponse(BaseModel):
    id: int
    name: str

router = APIRouter()

@router.post("/", response_model=RoomResponse)
async def create_room(roomDetails: RoomCreate, db: AsyncSession = Depends(get_db)):
    room = Room(name=roomDetails.name, user_id=roomDetails.user_id)
    db.add(room)
    await db.commit()

    return RoomResponse(name=room.name, id=room.id)