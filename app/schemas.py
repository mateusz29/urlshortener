from datetime import datetime

from enums import ExpirationOption
from pydantic import BaseModel, HttpUrl


class URLBase(BaseModel):
    original_url: HttpUrl


class URLCreate(URLBase):
    expires_in: ExpirationOption


class URLResponse(URLBase):
    short_url: str
    is_active: bool


class URLStats(BaseModel):
    original_url: str
    short_url: str
    created_at: datetime
    expires_at: datetime | None
    is_active: bool
    click_count: int
