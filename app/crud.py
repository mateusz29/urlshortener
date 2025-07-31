from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.enums import ExpirationOption
from app.models import URL
from app.utils import get_expiration_datetime


async def get_db_urls(skip: int, limit: int, db: AsyncSession) -> tuple[list[URL], int]:
    stmt = select(URL, func.count().over().label("total_count")).filter(URL.is_active).offset(skip).limit(limit)
    result = await db.execute(stmt)
    rows = result.all()

    if not rows:
        return [], 0

    urls = [row.URL for row in rows]
    total = rows[0].total_count
    return urls, total


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
