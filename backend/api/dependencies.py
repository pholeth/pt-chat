from datetime import datetime
import json
from fastapi import HTTPException, Header
import jwt
from sqlalchemy.ext.asyncio import AsyncSession
from config import settings
from consts import ALGORITHM
from db.session import async_session_maker

async def get_db() -> AsyncSession:
    async with async_session_maker() as session:
        yield session

def verify_token(authorization: str = Header(...)) -> str:
    try:
        _, access_token = authorization.split(" ")
        payload = jwt.decode(access_token, settings.secret_key, algorithms=[ALGORITHM])
        sub = payload.get("sub")

        if not sub:
            raise HTTPException(status_code=401, detail="Invalid token - Missing sub")

        if payload.get("exp") < datetime.now().timestamp():
            raise HTTPException(status_code=401, detail="Invalid token - Expired token")

        return sub
    except jwt.InvalidTokenError as e:
        print("Token Error", e)
        raise HTTPException(status_code=401, detail="Invalid token")
