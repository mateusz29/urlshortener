from contextlib import asynccontextmanager
from datetime import datetime, timezone
from io import BytesIO

from constants import BASE_URL, MAX_ATTEMPTS
from crud import (
    check_db_url_exists,
    create_db_url,
    get_db_url,
    get_db_urls,
    update_db_url_click_count,
    update_db_url_is_active,
)
from database import get_session, init_db
from fastapi import Depends, FastAPI, HTTPException
from fastapi.responses import RedirectResponse, StreamingResponse
from schemas import URLCreate, URLResponse, URLStats
from sqlalchemy.ext.asyncio import AsyncSession
from utils import generate_qr_code, generate_short_url


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(lifespan=lifespan)


def raise_bad_request(message: str):
    raise HTTPException(status_code=400, detail=message)


def raise_not_found(message: str):
    raise HTTPException(status_code=404, detail=message)


async def get_url_or_404(short_url: str, db: AsyncSession) -> URLResponse:
    db_url = await get_db_url(short_url, db)
    if not db_url:
        raise_not_found(f"URL '{short_url}' doesn't exist.")
    return db_url


@app.post("/shorten")
async def create_short_url(url: URLCreate, db: AsyncSession = Depends(get_session)) -> URLResponse:
    for _ in range(MAX_ATTEMPTS):
        short_url = generate_short_url()
        if not await check_db_url_exists(short_url, db):
            break
    else:
        raise_bad_request("Failed to generate a unique short code.")

    new_url = await create_db_url(short_url, str(url.original_url), url.expires_in, db)
    return new_url


@app.get("/urls")
async def get_all_urls(db: AsyncSession = Depends(get_session)) -> list[URLResponse]:
    urls = await get_db_urls(db)
    if not urls:
        raise_not_found("No URLs found")

    return urls


@app.get("/stats/{short_url}")
async def get_url_stats(short_url: str, db: AsyncSession = Depends(get_session)) -> URLStats:
    db_url = await get_url_or_404(short_url, db)

    return db_url


@app.get("/{short_url}")
async def redirect_to_original_url(short_url: str, db: AsyncSession = Depends(get_session)) -> RedirectResponse:
    db_url = await get_url_or_404(short_url, db)

    if db_url.expires_at and db_url.expires_at <= datetime.now(timezone.utc):
        await update_db_url_is_active(db_url, db)
        raise_not_found(f"URL '{short_url}' is expired.")

    await update_db_url_click_count(db_url, db)
    return RedirectResponse(db_url.original_url)


@app.get("/qr/{short_url}")
async def get_qr_code(short_url: str, db: AsyncSession = Depends(get_session)) -> StreamingResponse:
    _ = await get_url_or_404(short_url, db)

    short_url = f"{BASE_URL}/{short_url}"
    qr_code_bytes = generate_qr_code(short_url)

    return StreamingResponse(
        BytesIO(qr_code_bytes), media_type="image/png", headers={"Content-Disposition": "inline; filename=qr.png"}
    )
