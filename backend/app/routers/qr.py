from io import BytesIO

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_session
from app.routers.urls import get_url_or_404
from app.utils import generate_qr_code

router = APIRouter()


@router.get("/qr/{short_url}")
async def get_qr_code(short_url: str, db: AsyncSession = Depends(get_session)) -> StreamingResponse:
    _ = await get_url_or_404(short_url, db)

    short_url = f"{settings.base_url}/{short_url}"
    qr_code_bytes = generate_qr_code(short_url)

    return StreamingResponse(
        BytesIO(qr_code_bytes),
        media_type="image/png",
        headers={"Content-Disposition": "inline; filename=qr.png"},
    )
