from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from investment_lab.models import MarketSeries, PricePoint, Simulation, Strategy


def list_series(db: Session) -> list[MarketSeries]:
    return list(
        db.scalars(
            select(MarketSeries)
            .options(selectinload(MarketSeries.points))
            .order_by(MarketSeries.id)
        )
    )


def get_series(db: Session, series_id: int) -> MarketSeries | None:
    return db.scalar(
        select(MarketSeries)
        .options(selectinload(MarketSeries.points))
        .where(MarketSeries.id == series_id)
    )


def list_strategies(db: Session) -> list[Strategy]:
    return list(db.scalars(select(Strategy).order_by(Strategy.id)))


def list_simulations(db: Session) -> list[Simulation]:
    return list(db.scalars(select(Simulation).order_by(Simulation.id.desc())))


def get_point(db: Session, point_id: int) -> PricePoint | None:
    return db.get(PricePoint, point_id)
