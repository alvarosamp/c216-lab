from datetime import date
from decimal import Decimal

import pytest

from investment_lab.services.backtest import Observation, calculate_backtest


def observations():
    return [
        Observation(date(2026, 1, 2), Decimal("10")),
        Observation(date(2026, 1, 15), Decimal("8")),
        Observation(date(2026, 2, 2), Decimal("12")),
    ]


def test_buy_and_hold_applies_no_extra_contributions():
    result = calculate_backtest(observations(), "buy_hold", Decimal("100"), Decimal(0))
    assert result.invested == Decimal("100.00")
    assert result.final_value == Decimal("120.00")
    assert result.return_pct == Decimal("20.0000")
    assert result.max_drawdown_pct == Decimal("20.0000")


def test_dca_contributes_on_first_observed_day_of_next_month():
    result = calculate_backtest(observations(), "monthly_dca", Decimal("100"), Decimal("60"))
    assert result.invested == Decimal("160.00")
    assert result.final_value == Decimal("180.00")
    assert result.return_pct == Decimal("12.5000")
    assert result.curve[-1]["index"] == "120.00"


def test_requires_two_distinct_observations():
    with pytest.raises(ValueError, match="duas cotações"):
        calculate_backtest(observations()[:1], "buy_hold", Decimal("100"), Decimal(0))
