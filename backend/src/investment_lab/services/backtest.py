from dataclasses import dataclass
from datetime import date
from decimal import ROUND_HALF_UP, Decimal
from math import sqrt
from statistics import stdev


@dataclass(frozen=True)
class Observation:
    day: date
    price: Decimal


@dataclass(frozen=True)
class BacktestResult:
    invested: Decimal
    final_value: Decimal
    return_pct: Decimal
    max_drawdown_pct: Decimal
    volatility_pct: Decimal
    curve: list[dict]


def rounded(value: Decimal, places: str = "0.01") -> Decimal:
    return value.quantize(Decimal(places), rounding=ROUND_HALF_UP)


def calculate_backtest(
    observations: list[Observation], kind: str, initial: Decimal, contribution: Decimal
) -> BacktestResult:
    """Execute at observed closing prices; contributions occur on the first date of a new month."""
    if len(observations) < 2:
        raise ValueError("Selecione pelo menos duas cotações no período")
    if any(observations[i].day >= observations[i + 1].day for i in range(len(observations) - 1)):
        raise ValueError("As datas devem ser distintas e crescentes")
    if any(point.price <= 0 for point in observations):
        raise ValueError("Cotações precisam ser positivas")
    if initial <= 0 or contribution < 0 or kind not in {"buy_hold", "monthly_dca"}:
        raise ValueError("Parâmetros da estratégia inválidos")

    units = initial / observations[0].price
    invested = initial
    index = Decimal(100)
    peak = index
    max_drawdown = Decimal(0)
    daily_returns: list[float] = []
    curve: list[dict] = []

    for i, point in enumerate(observations):
        if i:
            daily_return = point.price / observations[i - 1].price - 1
            daily_returns.append(float(daily_return))
            index *= 1 + daily_return
            peak = max(peak, index)
            max_drawdown = max(max_drawdown, (peak - index) / peak * 100)
            if kind == "monthly_dca" and (point.day.year, point.day.month) != (
                observations[i - 1].day.year,
                observations[i - 1].day.month,
            ):
                units += contribution / point.price
                invested += contribution
        curve.append(
            {
                "date": point.day.isoformat(),
                "value": str(rounded(units * point.price)),
                "invested": str(rounded(invested)),
                "index": str(rounded(index)),
            }
        )

    final_value = rounded(units * observations[-1].price)
    volatility = stdev(daily_returns) * sqrt(252) * 100 if len(daily_returns) >= 2 else 0
    return BacktestResult(
        invested=rounded(invested),
        final_value=final_value,
        return_pct=rounded((final_value / invested - 1) * 100, "0.0001"),
        max_drawdown_pct=rounded(max_drawdown, "0.0001"),
        volatility_pct=rounded(Decimal(str(volatility)), "0.0001"),
        curve=curve,
    )
