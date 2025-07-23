from datetime import datetime

from enums import ExpirationOption
from pydantic import BaseModel, Field, HttpUrl, field_validator


class URLBase(BaseModel):
    original_url: HttpUrl


class URLCreate(URLBase):
    expires_in: ExpirationOption
    custom_alias: str | None = Field(None, min_length=3, max_length=20)

    @field_validator("custom_alias")
    def validate_custom_alias(cls, value: str | None) -> str | None:
        if value is None:
            return value

        reserved_words = {"urls, shorten", "stats", "urls"}
        if value.lower() in reserved_words:
            raise ValueError(f"'{value}' is a reserved word and cannot be used as a custom alias.")

        if not value.replace("-", "").replace("_", "").isalnum():
            raise ValueError("Alias can only contain letters, numbers, hyphens, and underscores.")

        return value.lower()


class URLResponse(URLBase):
    short_url: str
    is_active: bool
    expires_at: datetime | None


class URLStats(BaseModel):
    original_url: str
    short_url: str
    created_at: datetime
    expires_at: datetime | None
    is_active: bool
    click_count: int


class URLListResponse(BaseModel):
    urls: list[URLResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
