from fastapi import HTTPException, Header
import jwt
from sqlalchemy.ext.asyncio import AsyncSession
from config import settings
from consts import ALGORITHM
from db.session import async_session_maker

async def get_db() -> AsyncSession:
    async with async_session_maker() as session:
        yield session

def verify_token(authorization: str = Header(...)):
    try:
        _, access_token = authorization.split(" ")
        print(f"** {access_token} - {settings.secret_key}")
        payload = jwt.decode(access_token, settings.secret_key, algorithms=[ALGORITHM])

        return payload
    except jwt.InvalidTokenError as e:
        print("Token Error", e)
        raise HTTPException(status_code=401, detail="Invalid token")
