import logging
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from config import settings
from consts import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM
from models.user import User

from ..dependencies import get_db, verify_token

router = APIRouter()


class UserCreate(BaseModel):
    name: str = Field(..., max_length=255)


class UserCreateResponse(BaseModel):
    id: int
    name: str
    access_token: str
    token_expire_in: str


class UserResponse(BaseModel):
    id: int
    name: str


@router.post("/", response_model=UserCreateResponse)
async def create_user(user_create: UserCreate, db: AsyncSession = Depends(get_db)):
    user = User(name=user_create.name, messages=[])
    db.add(user)
    await db.commit()
    logging.info(f"User {user.name} added")

    exp = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = dict(sub=str(user.id), name=user.name, exp=exp)
    access_token = jwt.encode(to_encode, settings.secret_key, algorithm=ALGORITHM)

    token_expire_in = exp.isoformat(timespec="seconds")
    return UserCreateResponse(
        access_token=access_token,
        token_expire_in=token_expire_in,
        name=user.name,
        id=user.id,
    )


@router.get("/me", response_model=UserResponse)
async def me(user_id=Depends(verify_token), db: AsyncSession = Depends(get_db)):
    user = await db.get(User, user_id) if user_id is not None else None

    if user is None:
        return HTTPException(
            status_code=404, detail="No user found or token is invalid"
        )

    return UserResponse(id=user.id, name=user.name)
