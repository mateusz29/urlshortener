# URL Shortener

A modern, full-stack URL shortener service with a responsive web interface and robust API. Built with FastAPI backend and Next.js frontend, featuring QR code generation, click tracking, and expiration management.

🌐 **Live Demo:** [https://shortlink.lol](https://shortlink.lol)
📚 **API Documentation:** [https://api.shortlink.lol](https://api.shortlink.lol)

## Features

- **URL Shortening**: Create short, memorable links from long URLs
- **Flexible Expiration**: Set custom expiration times (1h, 6h, 24h, 7d, 30d, 365d, or indefinite)
- **Smart Redirects**: Automatic redirection to original URLs with click tracking
- **QR Code Generation**: Generate QR codes for easy mobile sharing
- **Analytics**: Track click counts, creation times, and expiration status
- **Responsive Frontend**: Modern web interface built with Next.js and shadcn/ui

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

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** (async) - Powerful SQL toolkit and ORM
- **PostgreSQL** - Robust relational database
- **Pydantic** - Data validation using Python type annotations
- **Alembic** - Database migration tool
- **Uvicorn** - Lightning-fast ASGI server

### Frontend
- **Next.js** - React framework for production-grade applications
- **shadcn/ui** - Modern, accessible component library
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework

### DevOps & Tools
- **Docker** - Containerized development and deployment
- **Railway** - Cloud deployment platform
- **uv** - Fast Python package manager
- **GitHub Actions** - Continuous integration and deployment

### Code Quality
- **Ruff** - Fast Python linter and formatter
- **mypy** - Static type checker for Python
- **pytest** - Testing framework with coverage reporting
- **pre-commit** - Git hooks for code quality enforcement

## Deployment

The application is deployed on Railway with automatic deployments from the main branch. The CI/CD pipeline includes:

- **Continuous Integration**: Automated testing, linting, and type checking on every PR
- **Continuous Deployment**: Automatic deployment to production on merge to main
- **Database Migrations**: Automatic migration execution during deployment

## TODO

### Completed ✅
- [x] Create responsive frontend
- [x] Add pagination
- [x] Use environment variables
- [x] Add tests
- [x] Use ruff and mypy
- [x] CI/CD setup
- [x] Deploy the app

### In Progress 🚧
- [ ] Add error handling improvements
- [ ] Implement rate limiting

### Planned 📋
- [ ] Add admin key, admin dashboard
- [ ] Add bulk shortening
- [ ] Add country/ip tracking
