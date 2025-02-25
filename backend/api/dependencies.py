from datetime import datetime
from typing import AsyncGenerator

import jwt
from fastapi import Header, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from config import settings
from consts import ALGORITHM
from db.session import async_session_maker


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session


def verify_token(authorization: str = Header(...)) -> int:
    try:
        _, access_token = authorization.split(" ")
        payload = jwt.decode(access_token, settings.secret_key, algorithms=[ALGORITHM])
        sub = payload.get("sub")

        if not sub:
            raise HTTPException(status_code=401, detail="Invalid token - Missing sub")

        if not sub.isdigit():
            raise HTTPException(status_code=401, detail="Invalid token - Invalid sub")

        if payload.get("exp") < datetime.now().timestamp():
            raise HTTPException(status_code=401, detail="Invalid token - Expired token")

        return int(sub)
    except jwt.InvalidTokenError as e:
        print("Token Error", e)
        raise HTTPException(status_code=401, detail="Invalid token") from e
