from datetime import date
from decimal import Decimal

from sqlalchemy import JSON, Date, ForeignKey, Numeric, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from investment_lab.database import Base


class MarketSeries(Base):
    __tablename__ = "market_series"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    symbol: Mapped[str] = mapped_column(String(24), unique=True)
    description: Mapped[str] = mapped_column(String(500), default="")
    points: Mapped[list["PricePoint"]] = relationship(
        back_populates="series", cascade="all, delete-orphan", order_by="PricePoint.day"
    )


class PricePoint(Base):
    __tablename__ = "price_points"
    __table_args__ = (UniqueConstraint("series_id", "day"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    series_id: Mapped[int] = mapped_column(ForeignKey("market_series.id", ondelete="CASCADE"))
    day: Mapped[date] = mapped_column(Date)
    price: Mapped[Decimal] = mapped_column(Numeric(18, 6))
    series: Mapped[MarketSeries] = relationship(back_populates="points")


class Strategy(Base):
    __tablename__ = "strategies"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    kind: Mapped[str] = mapped_column(String(20))
    initial_capital: Mapped[Decimal] = mapped_column(Numeric(18, 2))
    monthly_contribution: Mapped[Decimal] = mapped_column(Numeric(18, 2), default=0)


class Simulation(Base):
    __tablename__ = "simulations"

    id: Mapped[int] = mapped_column(primary_key=True)
    series_id: Mapped[int] = mapped_column(ForeignKey("market_series.id", ondelete="CASCADE"))
    strategy_id: Mapped[int] = mapped_column(ForeignKey("strategies.id", ondelete="CASCADE"))
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date] = mapped_column(Date)
    invested: Mapped[Decimal] = mapped_column(Numeric(18, 2))
    final_value: Mapped[Decimal] = mapped_column(Numeric(18, 2))
    return_pct: Mapped[Decimal] = mapped_column(Numeric(12, 4))
    max_drawdown_pct: Mapped[Decimal] = mapped_column(Numeric(12, 4))
    volatility_pct: Mapped[Decimal] = mapped_column(Numeric(12, 4))
    curve: Mapped[list[dict]] = mapped_column(JSON)
    series: Mapped[MarketSeries] = relationship()
    strategy: Mapped[Strategy] = relationship()
