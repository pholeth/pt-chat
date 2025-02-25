import logging

from fastapi import APIRouter, Depends, HTTPException
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
async def create_room(
    room_details: RoomCreate,
    user_id=Depends(verify_token),
    db: AsyncSession = Depends(get_db),
):
    room = Room(name=room_details.name, user_id=user_id)
    db.add(room)
    await db.commit()

    logging.info(f"Room {room.name} added")

    return RoomResponse(name=room.name, id=room.id)


@router.get("/list", response_model=RoomListResponse)
async def list_rooms(_=Depends(verify_token), db: AsyncSession = Depends(get_db)):
    results = await db.execute(select(Room))
    rooms = results.scalars().all()
    rooms_response = [RoomResponse(name=room.name, id=room.id) for room in rooms]
    return RoomListResponse(rooms=rooms_response)


@router.get("/{room_id}", response_model=RoomResponse)
async def get_room(
    room_id: str, _=Depends(verify_token), db: AsyncSession = Depends(get_db)
):
    room = await db.get(Room, int(room_id)) if room_id.isdigit() else None

    if room is None:
        return HTTPException(
            status_code=404, detail="No room found or token is invalid"
        )

    return RoomResponse(name=room.name, id=room.id)
