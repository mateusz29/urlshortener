import math
from datetime import UTC, datetime
from typing import Annotated, NoReturn

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import RedirectResponse
from pydantic import HttpUrl
from sqlalchemy.ext.asyncio import AsyncSession

from app.constants import MAX_ATTEMPTS
from app.crud import (
    check_db_url_exists,
    create_db_url,
    get_db_url,
    get_db_urls,
    update_db_url_click_count,
    update_db_url_is_active,
)
from app.database import get_session
from app.models import URL
from app.schemas import URLCreate, URLListResponse, URLResponse, URLStats
from app.utils import generate_short_url

router = APIRouter()


def raise_bad_request(message: str) -> None:
    raise HTTPException(status_code=400, detail=message)


def raise_not_found(message: str) -> NoReturn:
    raise HTTPException(status_code=404, detail=message)


async def get_url_or_404(short_url: str, db: AsyncSession) -> URL:
    db_url = await get_db_url(short_url, db)
    if not db_url:
        raise_not_found(f"URL '{short_url}' doesn't exist.")

    return db_url


@router.post("/shorten")
async def create_short_url(url: URLCreate, db: AsyncSession = Depends(get_session)) -> URLResponse:
    if url.custom_alias:
        if await check_db_url_exists(url.custom_alias, db):
            raise_bad_request(f"Alias {url.custom_alias} is already taken.")

        short_url = url.custom_alias
        is_custom_alias = True
    else:
        for _ in range(MAX_ATTEMPTS):
            short_url = generate_short_url()
            if not await check_db_url_exists(short_url, db):
                break
        else:
            raise_bad_request("Failed to generate a unique short code.")

        is_custom_alias = False

    new_url = await create_db_url(short_url, str(url.original_url), url.expires_in, db, is_custom_alias)

    return URLResponse(
        original_url=HttpUrl(url.original_url),
        short_url=new_url.short_url,
        is_active=new_url.is_active,
        expires_at=new_url.expires_at,
    )


@router.get("/urls")
async def get_all_urls(
    db: AsyncSession = Depends(get_session),
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 10,
) -> URLListResponse:
    skip = (page - 1) * page_size
    urls, total = await get_db_urls(skip, page_size, db)

    if not urls:
        raise_not_found("No URLs found")

    total_pages = math.ceil(total / page_size)

    url_responses = [
        URLResponse(
            original_url=HttpUrl(url.original_url),
            short_url=url.short_url,
            is_active=url.is_active,
            expires_at=url.expires_at,
        )
        for url in urls
    ]

    return URLListResponse(
        urls=url_responses,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/stats/{short_url}")
async def get_url_stats(short_url: str, db: AsyncSession = Depends(get_session)) -> URLStats:
    db_url = await get_url_or_404(short_url, db)

    return URLStats(
        original_url=HttpUrl(db_url.original_url),
        short_url=db_url.short_url,
        created_at=db_url.created_at,
        expires_at=db_url.expires_at,
        is_active=db_url.is_active,
        click_count=db_url.click_count,
    )


@router.get("/{short_url}")
async def redirect_to_original_url(short_url: str, db: AsyncSession = Depends(get_session)) -> RedirectResponse:
    db_url = await get_url_or_404(short_url, db)

    if db_url.expires_at and db_url.expires_at <= datetime.now(UTC):
        await update_db_url_is_active(db_url, db)
        raise_not_found(f"URL '{short_url}' is expired.")

    await update_db_url_click_count(db_url, db)
    return RedirectResponse(str(db_url.original_url))
