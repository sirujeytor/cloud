"""Abstract interface for OHLCV market data sources."""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime

import pandas as pd

REQUIRED_COLUMNS = ["open", "high", "low", "close", "volume"]


@dataclass(frozen=True)
class DataRequest:
    symbol: str
    timeframe: str
    start: datetime
    end: datetime


class MarketDataSource(ABC):
    """Common interface every data provider (Binance, CSV, synthetic) implements.

    Concrete sources must return a DataFrame indexed by UTC timestamp
    (``pandas.DatetimeIndex``, tz-aware, sorted ascending) with float columns
    ``open, high, low, close, volume``. Enforcing one shape here means the
    backtest engine and strategies never need to know where the bars came from.
    """

    @abstractmethod
    def get_ohlcv(
        self,
        symbol: str,
        timeframe: str,
        start: datetime,
        end: datetime,
    ) -> pd.DataFrame:
        """Return OHLCV bars for ``symbol`` between ``start`` and ``end`` (inclusive)."""
        raise NotImplementedError

    @staticmethod
    def validate(df: pd.DataFrame) -> pd.DataFrame:
        """Sanity-check and normalize a raw OHLCV frame before it reaches the engine."""
        if df.empty:
            raise ValueError("Data source returned an empty OHLCV frame.")

        missing = [c for c in REQUIRED_COLUMNS if c not in df.columns]
        if missing:
            raise ValueError(f"OHLCV frame is missing required columns: {missing}")

        if not isinstance(df.index, pd.DatetimeIndex):
            raise TypeError("OHLCV frame must be indexed by a DatetimeIndex.")

        df = df.sort_index()
        df = df[~df.index.duplicated(keep="last")]

        if df.index.tz is None:
            df.index = df.index.tz_localize("UTC")
        else:
            df.index = df.index.tz_convert("UTC")

        for col in REQUIRED_COLUMNS:
            df[col] = pd.to_numeric(df[col], errors="coerce")

        bad_rows = df[REQUIRED_COLUMNS].isna().any(axis=1)
        if bad_rows.any():
            df = df.loc[~bad_rows]

        if (df["high"] < df["low"]).any():
            raise ValueError("Found bars where high < low; refusing to backtest on corrupt data.")

        return df[REQUIRED_COLUMNS]
