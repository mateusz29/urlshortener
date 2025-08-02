import secrets
import string
from datetime import UTC, datetime, timedelta
from io import BytesIO

import qrcode

from app.enums import ExpirationOption


def generate_short_url(length: int = 10) -> str:
    aplhabet = string.ascii_letters + string.digits
    return "".join(secrets.choice(aplhabet) for _ in range(length))


def generate_qr_code(url: str) -> bytes:
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")

    buffer = BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)

    return buffer.getvalue()


def get_expiration_datetime(option: ExpirationOption) -> datetime | None:
    if option == ExpirationOption.indefinite:
        return None

    now = datetime.now(UTC)
    mapping = {
        ExpirationOption.one_hour: timedelta(hours=1),
        ExpirationOption.six_hours: timedelta(hours=6),
        ExpirationOption.one_day: timedelta(days=1),
        ExpirationOption.one_week: timedelta(weeks=1),
        ExpirationOption.one_month: timedelta(days=30),
        ExpirationOption.one_year: timedelta(days=365),
    }
    return now + mapping[option]
