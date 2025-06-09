import secrets
import string
from io import BytesIO

import qrcode


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
