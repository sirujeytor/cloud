"""Load OHLCV bars from a local CSV file.

Expected columns (case-insensitive): timestamp (or date/time), open, high,
low, close, volume. Timestamps may be ISO-8601 strings or Unix epoch
(seconds or milliseconds).
"""

from __future__ import annotations

from datetime import datetime
from pathlib import Path

import pandas as pd

from .base import MarketDataSource

_TIMESTAMP_ALIASES = ("timestamp", "date", "datetime", "time", "open_time")


class CSVDataSource(MarketDataSource):
    def __init__(self, path: str | Path):
        self.path = Path(path)
        if not self.path.exists():
            raise FileNotFoundError(f"CSV data file not found: {self.path}")

    def get_ohlcv(
        self,
        symbol: str,
        timeframe: str,
        start: datetime,
        end: datetime,
    ) -> pd.DataFrame:
        raw = pd.read_csv(self.path)
        raw.columns = [c.strip().lower() for c in raw.columns]

        ts_col = next((c for c in _TIMESTAMP_ALIASES if c in raw.columns), None)
        if ts_col is None:
            raise ValueError(
                f"Could not find a timestamp column in {self.path}. "
                f"Expected one of {_TIMESTAMP_ALIASES}."
            )

        if pd.api.types.is_numeric_dtype(raw[ts_col]):
            magnitude = raw[ts_col].abs().median()
            unit = "ms" if magnitude > 1e12 else "s"
            raw[ts_col] = pd.to_datetime(raw[ts_col], unit=unit, utc=True)
        else:
            raw[ts_col] = pd.to_datetime(raw[ts_col], utc=True)

        raw = raw.set_index(ts_col)
        df = self.validate(raw)

        start_ts = pd.Timestamp(start).tz_localize("UTC") if pd.Timestamp(start).tzinfo is None else pd.Timestamp(start)
        end_ts = pd.Timestamp(end).tz_localize("UTC") if pd.Timestamp(end).tzinfo is None else pd.Timestamp(end)
        return df.loc[(df.index >= start_ts) & (df.index <= end_ts)]
