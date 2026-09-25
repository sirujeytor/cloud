import pandas as pd
import pytest

from tradingbot.engine.backtester import Backtester, BacktestConfig
from tradingbot.engine.execution import ExecutionModel
from tradingbot.engine.risk import PositionSizer, RiskManager
from tradingbot.strategies.base import Strategy


class _FixedSignalStrategy(Strategy):
    """Returns a hand-picked signal series, for deterministic engine tests."""

    def __init__(self, values):
        self.values = values

    def generate_signals(self, df):
        return pd.Series(self.values, index=df.index, dtype=int)


def _make_df(opens):
    """5 bars with modest, non-overlapping high/low ranges around each open."""
    index = pd.date_range("2024-01-01", periods=len(opens), freq="1h", tz="UTC")
    opens = pd.Series(opens, index=index, dtype=float)
    closes = opens + 0.5
    highs = opens + 1.0
    lows = opens - 1.0
    return pd.DataFrame({"open": opens, "high": highs, "low": lows, "close": closes, "volume": 1000.0})


def _zero_cost_config(fraction=0.2):
    return BacktestConfig(
        initial_cash=100.0,
        execution=ExecutionModel(fee_bps=0, slippage_bps=0),
        position_sizer=PositionSizer(method="fixed_fraction", fraction=fraction),
    )


def test_signal_is_executed_one_bar_later_not_same_bar():
    df = _make_df([100, 101, 102, 103, 104])
    strategy = _FixedSignalStrategy([1, 1, 0, 0, 0])
    result = Backtester(_zero_cost_config()).run(df, strategy)

    assert len(result.closed_trades) == 1
    trade = result.closed_trades[0]

    # The signal turns on at bar 0 (using bar 0's own close) but must only be
    # realized at bar 1's open -- never at bar 0's own open/close.
    assert trade.entry_time == df.index[1]
    assert trade.entry_price == pytest.approx(101.0)

    # The signal turns off at bar 2 (using bar 2's close), realized at bar 3's open.
    assert trade.exit_time == df.index[3]
    assert trade.exit_price == pytest.approx(103.0)
    assert trade.exit_reason == "signal"


def test_position_sizing_and_final_equity_match_hand_calculation():
    df = _make_df([100, 101, 102, 103, 104])
    strategy = _FixedSignalStrategy([1, 1, 0, 0, 0])
    result = Backtester(_zero_cost_config(fraction=0.2)).run(df, strategy)

    qty = 20.0 / 101.0  # 20% of 100 cash committed at entry price 101
    trade = result.closed_trades[0]
    assert trade.quantity == pytest.approx(qty)

    expected_final_equity = 80.0 + qty * 103.0  # cash left + proceeds from selling at 103
    assert result.equity_curve.iloc[-1] == pytest.approx(expected_final_equity)


def test_never_holds_position_before_signal_bar():
    df = _make_df([100, 101, 102, 103, 104])
    # Long from the very first bar: since the engine always starts flat and
    # only acts on the *shifted* signal, bar 0 must still be flat.
    strategy = _FixedSignalStrategy([1, 1, 1, 1, 1])
    result = Backtester(_zero_cost_config()).run(df, strategy)

    first_bar_equity = result.equity_curve.iloc[0]
    assert first_bar_equity == pytest.approx(100.0)  # untouched cash, no lookahead entry


def test_end_of_data_closes_open_position():
    df = _make_df([100, 101, 102, 103, 104])
    strategy = _FixedSignalStrategy([0, 1, 1, 1, 1])
    result = Backtester(_zero_cost_config()).run(df, strategy)

    assert len(result.closed_trades) == 1
    trade = result.closed_trades[0]
    assert trade.exit_reason == "end_of_data"
    assert trade.exit_time == df.index[-1]


def test_stop_loss_triggers_on_intrabar_low():
    df = _make_df([100, 101, 80, 103, 104])  # bar 2's low will pierce a tight stop
    strategy = _FixedSignalStrategy([1, 1, 1, 1, 1])
    config = _zero_cost_config()
    config.risk_manager = RiskManager(stop_loss_pct=0.05)  # 5% below entry (101) = 95.95
    result = Backtester(config).run(df, strategy)

    assert len(result.closed_trades) >= 1
    first_trade = result.closed_trades[0]
    assert first_trade.exit_reason == "stop_loss"
    assert first_trade.exit_price == pytest.approx(101.0 * 0.95)


def test_shorting_disallowed_by_default_raises():
    df = _make_df([100, 101, 102, 103, 104])
    strategy = _FixedSignalStrategy([-1, -1, -1, -1, -1])
    with pytest.raises(ValueError):
        Backtester(_zero_cost_config()).run(df, strategy)


def test_shorting_allowed_when_configured():
    df = _make_df([100, 99, 98, 97, 96])  # falling market -> a short should profit
    strategy = _FixedSignalStrategy([-1, -1, -1, -1, -1])
    config = _zero_cost_config()
    config.allow_short = True
    result = Backtester(config).run(df, strategy)

    trade = [t for t in result.trades if not t.is_open][0] if result.closed_trades else result.trades[0]
    assert trade.side == "short"


def test_empty_dataframe_raises():
    df = _make_df([100])
    df = df.iloc[0:0]
    with pytest.raises(ValueError):
        Backtester(_zero_cost_config()).run(df, _FixedSignalStrategy([]))
