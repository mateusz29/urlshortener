from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class URL(Base):
    __tablename__ = "urls"

    id: Mapped[int] = mapped_column(primary_key=True)
    original_url: Mapped[str] = mapped_column(String, nullable=False)
    short_url: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.now(timezone.utc), nullable=False
    )
    expires_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    click_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_custom_alias: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )

    def __repr__(self):
        return (
            f"<URL(id={self.id}, original_url='{self.original_url}', "
            f"short_url='{self.short_url}', created_at={self.created_at}, "
            f"expires_at={self.expires_at}, is_active={self.is_active}, "
            f"click_count={self.click_count}, is_custom_alias={self.is_custom_alias})>"
        )
