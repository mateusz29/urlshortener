from datetime import UTC, datetime, timedelta
from unittest.mock import AsyncMock

import pytest
from pydantic import HttpUrl
from sqlalchemy.ext.asyncio import AsyncSession

from app.enums import ExpirationOption
from app.schemas import URLCreate


@pytest.fixture
def mock_db_session() -> AsyncMock:
    return AsyncMock(spec=AsyncSession)


@pytest.fixture
def sample_url_data() -> URLCreate:
    return URLCreate(
        original_url=HttpUrl("https://example.com"), custom_alias=None, expires_in=ExpirationOption.indefinite
    )


@pytest.fixture
def sample_url_data_with_custom_alias() -> URLCreate:
    return URLCreate(
        original_url=HttpUrl("https://example.com"), custom_alias="custom123", expires_in=ExpirationOption.indefinite
    )


class MockURL:
    def __init__(
        self,
        original_url: str = "https://example.com",
        short_url: str = "abc123",
        is_active: bool = True,
        expires_at: datetime | None = None,
        click_count: int = 0,
        created_at: datetime | None = None,
        is_custom_alias: bool = False,
    ):
        self.original_url = original_url
        self.short_url = short_url
        self.is_active = is_active
        self.expires_at = expires_at
        self.click_count = click_count
        self.created_at = created_at or datetime.now(UTC)
        self.is_custom_alias = is_custom_alias


@pytest.fixture
def sample_db_url() -> MockURL:
    return MockURL()


@pytest.fixture
def sample_expired_url() -> MockURL:
    return MockURL(expires_at=datetime.now(UTC) - timedelta(hours=1), short_url="expired123")


@pytest.fixture
def sample_custom_alias_url() -> MockURL:
    return MockURL(short_url="custom123", is_custom_alias=True)


@pytest.fixture
def multiple_db_urls() -> list[MockURL]:
    return [
        MockURL(original_url="https://example1.com", short_url="abc123"),
        MockURL(original_url="https://example2.com", short_url="def456"),
        MockURL(original_url="https://example3.com", short_url="ghi789"),
    ]
