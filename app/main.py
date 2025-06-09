from contextlib import asynccontextmanager

from constants import MAX_ATTEMPTS
from crud import check_db_url_exists, create_db_url, get_db_url
from database import get_session, init_db
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.responses import RedirectResponse
from schemas import URLCreate, URLResponse
from sqlalchemy.ext.asyncio import AsyncSession
from utils import generate_short_url


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(lifespan=lifespan)


def raise_bad_request(message: str):
    raise HTTPException(status_code=400, detail=message)


def raise_not_found(request: Request):
    message = f"URL '{request.url}' doesn't exist"
    raise HTTPException(status_code=404, detail=message)


@app.post("/shorten")
async def create_short_url(url: URLCreate, db: AsyncSession = Depends(get_session)) -> URLResponse:
    for _ in range(MAX_ATTEMPTS):
        short_url = generate_short_url()
        if not await check_db_url_exists(short_url, db):
            break
    else:
        raise_bad_request("Failed to generate a unique short code.")

    new_url = await create_db_url(short_url, str(url.original_url), db)
    return new_url


@app.get("/{short_url}")
async def redirect_to_original_url(short_url: str, db: AsyncSession = Depends(get_session)) -> RedirectResponse:
    db_url = await get_db_url(short_url, db)
    if not db_url:
        raise_not_found(Request)

    db_url.click_count += 1
    await db.commit()
    await db.refresh(db_url)

    return RedirectResponse(db_url.original_url)
