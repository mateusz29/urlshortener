from enums import ExpirationOption
from models import URL
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from utils import get_expiration_datetime


async def get_db_urls(db: AsyncSession) -> list[URL]:
    stmt = select(URL).filter(URL.is_active)
    result = await db.scalars(stmt)
    return list(result.all())


async def get_db_url(short_url: str, db: AsyncSession) -> URL | None:
    stmt = select(URL).filter(URL.short_url == short_url, URL.is_active)
    result = await db.scalars(stmt)
    return result.first()


async def check_db_url_exists(short_url: str, db: AsyncSession) -> bool:
    return await get_db_url(short_url, db) is not None


async def create_db_url(
    short_url: str,
    original_url: str,
    expires_in: ExpirationOption,
    db: AsyncSession,
    is_custom_alias: bool = False,
) -> URL:
    new_url = URL(
        short_url=short_url,
        original_url=original_url,
        expires_at=get_expiration_datetime(expires_in),
        is_custom_alias=is_custom_alias,
    )

    db.add(new_url)
    await db.commit()
    await db.refresh(new_url)
    return new_url


async def update_db_url_click_count(db_url: URL, db: AsyncSession) -> URL:
    db_url.click_count += 1
    await db.commit()
    await db.refresh(db_url)
    return db_url


async def update_db_url_is_active(db_url: URL, db: AsyncSession) -> URL:
    db_url.is_active = False
    await db.commit()
    await db.refresh(db_url)
    return db_url
