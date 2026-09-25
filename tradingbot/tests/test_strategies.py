import pandas as pd
import pytest

from tradingbot.strategies import (
    SmaCrossoverStrategy,
    EmaCrossoverStrategy,
    RsiReversionStrategy,
    BollingerBandsStrategy,
    MacdTrendStrategy,
    GridStrategy,
)


def test_sma_crossover_goes_long_in_uptrend(uptrend_df):
    strategy = SmaCrossoverStrategy(fast_window=5, slow_window=20)
    signals = strategy.generate_signals(uptrend_df)
    assert set(signals.unique()).issubset({0, 1})
    # Once both averages have warmed up on a strict uptrend, fast > slow.
    assert signals.iloc[-1] == 1


def test_sma_crossover_rejects_bad_windows():
    with pytest.raises(ValueError):
        SmaCrossoverStrategy(fast_window=50, slow_window=10)


def test_ema_crossover_goes_long_in_uptrend(uptrend_df):
    strategy = EmaCrossoverStrategy(fast_span=5, slow_span=20)
    signals = strategy.generate_signals(uptrend_df)
    assert signals.iloc[-1] == 1


def test_macd_trend_goes_long_in_uptrend(uptrend_df):
    strategy = MacdTrendStrategy(fast=5, slow=20, signal=5)
    signals = strategy.generate_signals(uptrend_df)
    assert signals.iloc[-1] == 1


def test_signals_only_use_past_data(synthetic_df):
    """Truncating the tail of the dataframe must not change earlier signals --
    otherwise the strategy is peeking into the future."""
    strategy = SmaCrossoverStrategy(fast_window=5, slow_window=20)
    full_signals = strategy.generate_signals(synthetic_df)

    cutoff = len(synthetic_df) - 10
    truncated = synthetic_df.iloc[:cutoff]
    truncated_signals = strategy.generate_signals(truncated)

    pd.testing.assert_series_equal(
        full_signals.iloc[:cutoff], truncated_signals, check_names=False
    )


def test_rsi_reversion_produces_binary_signal(synthetic_df):
    strategy = RsiReversionStrategy(window=14, oversold=30, exit_level=55)
    signals = strategy.generate_signals(synthetic_df)
    assert set(signals.unique()).issubset({0, 1})


def test_bollinger_bands_produces_binary_signal(synthetic_df):
    strategy = BollingerBandsStrategy(window=20, num_std=2.0)
    signals = strategy.generate_signals(synthetic_df)
    assert set(signals.unique()).issubset({0, 1})


def test_grid_strategy_long_below_midpoint():
    index = pd.date_range("2024-01-01", periods=5, freq="1h", tz="UTC")
    df = pd.DataFrame(
        {"open": [90, 95, 100, 105, 110], "high": [91, 96, 101, 106, 111],
         "low": [89, 94, 99, 104, 109], "close": [90, 95, 100, 105, 110],
         "volume": [1] * 5},
        index=index,
    )
    strategy = GridStrategy(lower=80, upper=120, num_levels=4)
    signals = strategy.generate_signals(df)
    assert list(signals) == [1, 1, 0, 0, 0]


def test_grid_strategy_rejects_bad_range():
    with pytest.raises(ValueError):
        GridStrategy(lower=100, upper=50)
