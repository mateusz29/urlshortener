from datetime import datetime

from pydantic import BaseModel, HttpUrl


class URLBase(BaseModel):
    original_url: HttpUrl


class URLCreate(URLBase):
    pass


class URLResponse(URLBase):
    short_url: str
    created_at: datetime
    is_active: bool


class URLStats(BaseModel):
    original_url: str
    short_url: str
    created_at: datetime
    is_active: bool
    click_count: int
