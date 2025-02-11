
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from consts import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM
from config import settings
from models.user import User
from ..dependencies import get_db, verify_token

import jwt

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
async def create_user(userCreate: UserCreate, db: AsyncSession = Depends(get_db)):
    user = User(name=userCreate.name, messages=[])
    db.add(user)
    await db.commit()

    exp = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = dict(sub=str(user.id), name=user.name, exp=exp)
    access_token = jwt.encode(to_encode, settings.secret_key, algorithm=ALGORITHM)

    token_expire_in = exp.isoformat(timespec='seconds')
    return UserCreateResponse(access_token=access_token, token_expire_in=token_expire_in, name=user.name, id=user.id)

@router.get("/me", response_model=UserResponse)
async def me(payload = Depends(verify_token), db: AsyncSession = Depends(get_db)):
    user_id: str = payload.get("sub")
    user = await db.get(User, int(user_id)) if user_id.isdigit() else None

    if user is None:
        return HTTPException(status_code=404, detail="No user found or token is invalid")

    return UserResponse(id=user.id, name=user.name)