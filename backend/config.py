from dotenv import load_dotenv
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "PT Chat"
    env: str = 'development'
    postgres_host: str
    postgres_port: int = 5432
    postgres_user: str
    postgres_password: str
    db_name: str
    secret_key: str

    # class Config:
    #     env_file = ".env"

load_dotenv()
settings = Settings()