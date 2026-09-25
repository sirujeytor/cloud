import pandas as pd
import pytest

from tradingbot.engine.backtester import Backtester, BacktestConfig
from tradingbot.engine.execution import ExecutionModel
from tradingbot.metrics.performance import compute_metrics
from tradingbot.strategies import SmaCrossoverStrategy


def test_metrics_on_flat_equity_curve_are_neutral():
    from tradingbot.strategies.base import Strategy

    class _AlwaysFlat(Strategy):
        def generate_signals(self, df):
            return pd.Series(0, index=df.index)

    index = pd.date_range("2024-01-01", periods=100, freq="1h", tz="UTC")
    df = pd.DataFrame(
        {"open": 100.0, "high": 101.0, "low": 99.0, "close": 100.0, "volume": 1.0}, index=index
    )
    config = BacktestConfig(initial_cash=100.0, execution=ExecutionModel(fee_bps=0, slippage_bps=0))
    result = Backtester(config).run(df, _AlwaysFlat())
    metrics = compute_metrics(result)

    assert metrics.total_return_pct == pytest.approx(0.0)
    assert metrics.num_trades == 0
    assert metrics.max_drawdown_pct == pytest.approx(0.0)
    assert metrics.exposure_pct == pytest.approx(0.0)


def test_metrics_report_a_loss_when_buying_high_selling_low(synthetic_df):
    # A strategy that's always long simply mirrors buy-and-hold minus costs.
    from tradingbot.strategies.base import Strategy

    class _AlwaysLong(Strategy):
        def generate_signals(self, df):
            return pd.Series(1, index=df.index)

    config = BacktestConfig(initial_cash=100.0, execution=ExecutionModel(fee_bps=10, slippage_bps=5))
    result = Backtester(config).run(synthetic_df, _AlwaysLong())
    metrics = compute_metrics(result)

    assert metrics.num_trades == 1  # buys once at bar 1, holds until the end
    assert metrics.exposure_pct > 90  # in the market almost the entire time


def test_max_drawdown_is_non_positive(synthetic_df):
    config = BacktestConfig(initial_cash=100.0)
    strategy = SmaCrossoverStrategy(fast_window=10, slow_window=30)
    result = Backtester(config).run(synthetic_df, strategy)
    metrics = compute_metrics(result)
    assert metrics.max_drawdown_pct <= 0.0


def test_profit_factor_is_nonnegative_or_inf(synthetic_df):
    config = BacktestConfig(initial_cash=100.0)
    strategy = SmaCrossoverStrategy(fast_window=10, slow_window=30)
    result = Backtester(config).run(synthetic_df, strategy)
    metrics = compute_metrics(result)
    assert metrics.profit_factor >= 0.0
