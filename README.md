# URL Shortener API

A simple and extensible FastAPI-based URL shortener service with QR code generation.

## Features

- Shorten URLs
- Set expiration (1h, 6h, 24h, 7d, 30d, 365d, indefinite)
- Redirect to original URL
- Track click count
- View QR codes
- View statistics for each short URL
- Expired links automatically deactivated

## Running the App

```bash
uvicorn main:app --host 0.0.0.0 --port 80 --reload
```

## API Endpoints

### `POST /shorten` – Create a short URL  
**Request body:**
```json
{
  "original_url": "https://example.com",
  "expires_in": "1h"  // Options: 1h, 6h, 24h, 7d, 30d, 365d, never
}
```

### `GET /{short_url}` – Redirect to the original URL
### `GET /stats/{short_url}` – Get stats (click count, creation time, expiration)
### `GET /qr/{short_url}` – Get a QR code image
### `GET /urls` – List all active shortened URLs

## Tech Stack

- FastAPI
- SQLAlchemy (async)
- PostgreSQL
- Pydantic
- Uvicorn

## TODO

- [ ] Create responsive frontend
- [ ] Use environment variables
- [ ] Add error handling
- [ ] Add tests
- [x] Use ruff and mypy
- [ ] CI/CD setup
- [ ] Deploy the app
- [ ] Implement rate limiting
- [ ] Add admin key, admin dashboard
- [ ] Add bulk shortening
- [ ] Add country/ip tracking
- [ ] Make stats better

## Development Commands

### Run ruff to check and fix issues

```bash
ruff check . --fix
```

### Apply formatting with ruff

```bash
ruff format .
```

### Run type checking with mypy

```bash
mypy .
```

### Run tests with verbose output

```bash
pytest -v ./tests/
```
