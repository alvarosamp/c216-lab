from datetime import date
from decimal import Decimal

from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from investment_lab.database import Base
from investment_lab.repositories.catalog import list_simulations
from investment_lab.schemas import PointInput, SeriesInput, SimulationInput, StrategyInput
from investment_lab.services import catalog


def test_saved_simulation_survives_new_database_session():
    engine = create_engine("sqlite://", poolclass=StaticPool)
    Base.metadata.create_all(engine)
    with Session(engine) as db:
        series = catalog.create_series(db, SeriesInput(name="Exemplo", symbol="EX"))
        catalog.create_point(db, series.id, PointInput(day=date(2026, 1, 2), price=Decimal(10)))
        catalog.create_point(db, series.id, PointInput(day=date(2026, 2, 2), price=Decimal(12)))
        strategy = catalog.create_strategy(
            db,
            StrategyInput(
                name="Aporte mensal",
                kind="monthly_dca",
                initial_capital=Decimal(100),
                monthly_contribution=Decimal(60),
            ),
        )
        catalog.run_simulation(
            db,
            SimulationInput(
                series_id=series.id,
                strategy_id=strategy.id,
                start_date=date(2026, 1, 1),
                end_date=date(2026, 2, 28),
            ),
        )
    with Session(engine) as db:
        assert list_simulations(db)[0].final_value == Decimal("180.00")
    engine.dispose()
