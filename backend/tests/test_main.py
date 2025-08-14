from unittest.mock import AsyncMock, patch

import pytest
from fastapi import HTTPException
from pydantic import HttpUrl

from app.routers.qr import get_qr_code
from app.routers.urls import (
    create_short_url,
    get_all_urls,
    get_url_or_404,
    get_url_stats,
    raise_bad_request,
    raise_not_found,
    redirect_to_original_url,
)
from app.schemas import URLCreate, URLResponse, URLStats
from tests.conftest import MockURL


class TestUtilityFunctions:
    def test_raise_bad_request(self) -> None:
        with pytest.raises(HTTPException) as exc_info:
            raise_bad_request("Test message")

        assert exc_info.value.status_code == 400
        assert exc_info.value.detail == "Test message"

    def test_raise_not_found(self) -> None:
        with pytest.raises(HTTPException) as exc_info:
            raise_not_found("Test message")

        assert exc_info.value.status_code == 404
        assert exc_info.value.detail == "Test message"


class TestGetUrlOr404:
    @pytest.mark.asyncio
    async def test_get_url_or_404_success(self, mock_db_session: AsyncMock, sample_db_url: MockURL) -> None:
        with patch("app.routers.urls.get_db_url", new_callable=AsyncMock, return_value=sample_db_url):
            result = await get_url_or_404("abc123", mock_db_session)
            assert result == sample_db_url

    @pytest.mark.asyncio
    async def test_get_url_or_404_not_found(self, mock_db_session: AsyncMock) -> None:
        with patch("app.routers.urls.get_db_url", new_callable=AsyncMock, return_value=None):
            with pytest.raises(HTTPException) as exc_info:
                await get_url_or_404("nonexistent", mock_db_session)

            assert exc_info.value.status_code == 404
            assert "doesn't exist" in exc_info.value.detail


class TestCreateShortUrl:
    @pytest.mark.asyncio
    async def test_create_short_url_with_custom_alias(
        self, mock_db_session: AsyncMock, sample_url_data_with_custom_alias: URLCreate, sample_custom_alias_url: MockURL
    ) -> None:
        with (
            patch("app.routers.urls.check_db_url_exists", new_callable=AsyncMock, return_value=False),
            patch("app.routers.urls.create_db_url", new_callable=AsyncMock, return_value=sample_custom_alias_url),
        ):
            result = await create_short_url(sample_url_data_with_custom_alias, mock_db_session)

            expected_response = URLResponse(
                original_url=HttpUrl(sample_custom_alias_url.original_url),
                short_url=sample_custom_alias_url.short_url,
                is_active=sample_custom_alias_url.is_active,
                expires_at=sample_custom_alias_url.expires_at,
            )
            assert result == expected_response

    @pytest.mark.asyncio
    async def test_create_short_url_custom_alias_taken(
        self, mock_db_session: AsyncMock, sample_url_data_with_custom_alias: URLCreate
    ) -> None:
        with patch("app.routers.urls.check_db_url_exists", new_callable=AsyncMock, return_value=True):
            with pytest.raises(HTTPException) as exc_info:
                await create_short_url(sample_url_data_with_custom_alias, mock_db_session)

            assert exc_info.value.status_code == 400
            assert "already taken" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_create_short_url_without_custom_alias(
        self, mock_db_session: AsyncMock, sample_url_data: URLCreate, sample_db_url: MockURL
    ) -> None:
        with (
            patch("app.routers.urls.generate_short_url", return_value="abc123"),
            patch("app.routers.urls.check_db_url_exists", new_callable=AsyncMock, return_value=False),
            patch("app.routers.urls.create_db_url", new_callable=AsyncMock, return_value=sample_db_url),
        ):
            result = await create_short_url(sample_url_data, mock_db_session)

            expected_response = URLResponse(
                original_url=HttpUrl(sample_db_url.original_url),
                short_url=sample_db_url.short_url,
                is_active=sample_db_url.is_active,
                expires_at=sample_db_url.expires_at,
            )
            assert result == expected_response

    @pytest.mark.asyncio
    async def test_create_short_url_generation_failure(
        self, mock_db_session: AsyncMock, sample_url_data: URLCreate
    ) -> None:
        with (
            patch("app.routers.urls.generate_short_url", return_value="abc123"),
            patch("app.routers.urls.check_db_url_exists", new_callable=AsyncMock, return_value=True),
        ):
            with pytest.raises(HTTPException) as exc_info:
                await create_short_url(sample_url_data, mock_db_session)

            assert exc_info.value.status_code == 400
            assert "Failed to generate" in exc_info.value.detail


class TestGetAllUrls:
    @pytest.mark.asyncio
    async def test_get_all_urls_success(self, mock_db_session: AsyncMock, multiple_db_urls: list[MockURL]) -> None:
        with patch(
            "app.routers.urls.get_db_urls",
            new_callable=AsyncMock,
            return_value=(multiple_db_urls, len(multiple_db_urls)),
        ):
            result = await get_all_urls(mock_db_session, 1, 10)

            assert result.total == 3
            assert result.page == 1
            assert result.page_size == 10
            assert result.total_pages == 1
            assert len(result.urls) == 3

    @pytest.mark.asyncio
    async def test_get_all_urls_empty(self, mock_db_session: AsyncMock) -> None:
        with patch("app.routers.urls.get_db_urls", new_callable=AsyncMock, return_value=([], 0)):
            with pytest.raises(HTTPException) as exc_info:
                await get_all_urls(mock_db_session, 1, 10)

            assert exc_info.value.status_code == 404
            assert "No URLs found" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_get_all_urls_pagination(self, mock_db_session: AsyncMock, multiple_db_urls: list[MockURL]) -> None:
        # Test second page with page_size=2
        page_urls = multiple_db_urls[2:3]

        with patch("app.routers.urls.get_db_urls", new_callable=AsyncMock, return_value=(page_urls, 3)):
            result = await get_all_urls(mock_db_session, 2, 2)

            assert result.total == 3
            assert result.page == 2
            assert result.page_size == 2
            assert result.total_pages == 2
            assert len(result.urls) == 1


class TestGetUrlStats:
    @pytest.mark.asyncio
    async def test_get_url_stats_success(self, mock_db_session: AsyncMock, sample_db_url: MockURL) -> None:
        with patch("app.routers.urls.get_url_or_404", new_callable=AsyncMock, return_value=sample_db_url):
            result = await get_url_stats("abc123", mock_db_session)

            expected_response = URLStats(
                original_url=HttpUrl(sample_db_url.original_url),
                short_url=sample_db_url.short_url,
                is_active=sample_db_url.is_active,
                expires_at=sample_db_url.expires_at,
                created_at=sample_db_url.created_at,
                click_count=sample_db_url.click_count,
            )
            assert result == expected_response


class TestRedirectToOriginalUrl:
    @pytest.mark.asyncio
    async def test_redirect_success(self, mock_db_session: AsyncMock, sample_db_url: MockURL) -> None:
        with (
            patch("app.routers.urls.get_url_or_404", new_callable=AsyncMock, return_value=sample_db_url),
            patch("app.routers.urls.update_db_url_click_count", new_callable=AsyncMock) as mock_update,
        ):
            result = await redirect_to_original_url("abc123", mock_db_session)

            assert result.headers["location"] == sample_db_url.original_url
            assert result.status_code == 307
            mock_update.assert_called_once_with(sample_db_url, mock_db_session)

    @pytest.mark.asyncio
    async def test_redirect_expired_url(self, mock_db_session: AsyncMock, sample_expired_url: MockURL) -> None:
        with (
            patch("app.routers.urls.get_url_or_404", new_callable=AsyncMock, return_value=sample_expired_url),
            patch("app.routers.urls.update_db_url_is_active", new_callable=AsyncMock) as mock_update,
        ):
            with pytest.raises(HTTPException) as exc_info:
                await redirect_to_original_url("expired123", mock_db_session)

            assert exc_info.value.status_code == 404
            assert "expired" in exc_info.value.detail
            mock_update.assert_called_once_with(sample_expired_url, mock_db_session)


class TestGetQrCode:
    @pytest.mark.asyncio
    async def test_get_qr_code_success(self, mock_db_session: AsyncMock, sample_db_url: MockURL) -> None:
        mock_qr_bytes = b"fake_qr_code_data"

        with (
            patch("app.routers.qr.get_url_or_404", new_callable=AsyncMock, return_value=sample_db_url),
            patch("app.routers.qr.generate_qr_code", return_value=mock_qr_bytes),
        ):
            result = await get_qr_code("abc123", mock_db_session)

            assert result.media_type == "image/png"
            assert "qr.png" in result.headers["Content-Disposition"]
