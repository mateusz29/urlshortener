from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

    postgres_user: str = Field(default="", validation_alias=AliasChoices("PGUSER", "POSTGRES_USER"))
    postgres_password: str = Field(default="", validation_alias=AliasChoices("PGPASSWORD", "POSTGRES_PASSWORD"))
    postgres_db: str = Field(default="", validation_alias=AliasChoices("PGDATABASE", "POSTGRES_DB"))
    postgres_host: str = Field(default="", validation_alias=AliasChoices("PGHOST", "POSTGRES_HOST"))
    postgres_port: int = Field(default=5432, validation_alias=AliasChoices("PGPORT", "POSTGRES_PORT"))
    base_url: str = Field(default="", validation_alias=AliasChoices("BASE_URL"))

    @property
    def db_url(self) -> str:
        return (
            f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    @property
    def db_url_sync(self) -> str:
        return (
            f"postgresql://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )


settings = Settings()
