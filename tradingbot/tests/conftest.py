import pandas as pd
import pytest

from tradingbot.data.synthetic import SyntheticDataSource


@pytest.fixture
def synthetic_df():
    source = SyntheticDataSource(seed=7)
    return source.get_ohlcv("BTC/USDT", "1h", pd.Timestamp("2024-01-01"), pd.Timestamp("2024-03-01"))


@pytest.fixture
def uptrend_df():
    """A deterministic, monotonically rising price series -- useful for
    asserting a trend-following strategy actually captures a known trend."""
    index = pd.date_range("2024-01-01", periods=200, freq="1h", tz="UTC")
    close = pd.Series(range(200), index=index, dtype=float) * 0.5 + 100
    df = pd.DataFrame(
        {
            "open": close.shift(1).fillna(close.iloc[0]),
            "high": close + 0.1,
            "low": close - 0.1,
            "close": close,
            "volume": 1000.0,
        },
        index=index,
    )
    return df
