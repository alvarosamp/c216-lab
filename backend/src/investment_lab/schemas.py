from datetime import date
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator


class SeriesInput(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    symbol: str = Field(min_length=2, max_length=24, pattern=r"^[A-Za-z0-9._-]+$")
    description: str = Field(default="", max_length=500)


class PointInput(BaseModel):
    day: date
    price: Decimal = Field(gt=0, max_digits=18, decimal_places=6)


class PointOutput(PointInput):
    model_config = ConfigDict(from_attributes=True)
    id: int


class SeriesOutput(SeriesInput):
    model_config = ConfigDict(from_attributes=True)
    id: int
    points: list[PointOutput]


class StrategyInput(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    kind: Literal["buy_hold", "monthly_dca"]
    initial_capital: Decimal = Field(gt=0, max_digits=18, decimal_places=2)
    monthly_contribution: Decimal = Field(default=Decimal(0), ge=0, max_digits=18, decimal_places=2)

    @model_validator(mode="after")
    def validate_contribution(self):
        if self.kind == "buy_hold" and self.monthly_contribution != 0:
            raise ValueError("Comprar e manter não aceita aportes mensais")
        if self.kind == "monthly_dca" and self.monthly_contribution <= 0:
            raise ValueError("Aporte mensal deve ser maior que zero")
        return self


class StrategyOutput(StrategyInput):
    model_config = ConfigDict(from_attributes=True)
    id: int


class SimulationInput(BaseModel):
    series_id: int
    strategy_id: int
    start_date: date
    end_date: date


class SimulationOutput(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    series_id: int
    strategy_id: int
    start_date: date
    end_date: date
    invested: Decimal
    final_value: Decimal
    return_pct: Decimal
    max_drawdown_pct: Decimal
    volatility_pct: Decimal
    curve: list[dict]
