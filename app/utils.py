import secrets
import string


def generate_short_url(length: int = 10) -> str:
    aplhabet = string.ascii_letters + string.digits
    return "".join(secrets.choice(aplhabet) for _ in range(length))
