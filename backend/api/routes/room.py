import logging
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.room import Room
from ..dependencies import get_db, verify_token

class RoomCreate(BaseModel):
    name: str = Field(max_length=255)

class RoomResponse(BaseModel):
    id: int
    name: str

class RoomListResponse(BaseModel):
    rooms: list[RoomResponse]

router = APIRouter()

@router.post("/", response_model=RoomResponse)
async def create_room(roomDetails: RoomCreate, user_id = Depends(verify_token), db: AsyncSession = Depends(get_db)):
    room = Room(name=roomDetails.name, user_id=user_id)
    db.add(room)
    await db.commit()

    logging.info(f"Room {room.name} added")

    return RoomResponse(name=room.name, id=room.id)

@router.get("/list", response_model=RoomListResponse)
async def list_rooms(_ = Depends(verify_token), db: AsyncSession = Depends(get_db)):
    results = await db.execute(select(Room))
    rooms = results.scalars().all()
    rooms_response = [RoomResponse(name=room.name, id=room.id) for room in rooms]
    return RoomListResponse(rooms=rooms_response)