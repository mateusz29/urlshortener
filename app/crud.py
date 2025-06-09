from datetime import datetime, timezone

from enums import ExpirationOption
from models import URL
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from utils import get_expiration_datetime


async def get_db_urls(db: AsyncSession) -> list[URL] | None:
    stmt = select(URL).filter(URL.is_active)
    result = await db.scalars(stmt)
    return result.all()


async def get_db_url(short_url: str, db: AsyncSession) -> URL | None:
    stmt = select(URL).filter(URL.short_url == short_url, URL.is_active)
    result = await db.scalars(stmt)
    return result.first()


async def check_db_url_exists(short_url: str, db: AsyncSession) -> bool:
    result = await get_db_url(short_url, db)
    if result:
        return True
    else:
        return False


async def create_db_url(short_url: str, original_url: str, expires_in: ExpirationOption, db: AsyncSession) -> URL:
    new_url = URL(
        short_url=short_url,
        original_url=original_url,
        created_at=datetime.now(timezone.utc),
        expires_at=get_expiration_datetime(expires_in),
        is_active=True,
        click_count=0,
    )
    db.add(new_url)
    await db.commit()
    await db.refresh(new_url)
    return new_url


async def update_db_url_click_count(db_url: URL, db: AsyncSession):
    db_url.click_count += 1
    await db.commit()
    await db.refresh(db_url)
    return db_url


async def update_db_url_is_active(db_url: URL, db: AsyncSession):
    db_url.is_active = False
    await db.commit()
    await db.refresh(db_url)
    return db_url
