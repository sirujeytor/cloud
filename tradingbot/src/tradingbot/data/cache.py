"""Simple on-disk parquet cache keyed by (symbol, timeframe).

Avoids re-downloading the same historical range from Binance on every
backtest run. Each cache file stores the full history fetched so far for a
symbol/timeframe pair; new requests only fetch the missing edges.
"""

from __future__ import annotations

from pathlib import Path

import pandas as pd

DEFAULT_CACHE_DIR = Path(__file__).resolve().parents[3] / "data_cache"


class OhlcvCache:
    def __init__(self, cache_dir: str | Path = DEFAULT_CACHE_DIR):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)

    def _path(self, symbol: str, timeframe: str) -> Path:
        safe_symbol = symbol.replace("/", "-")
        return self.cache_dir / f"{safe_symbol}_{timeframe}.parquet"

    def load(self, symbol: str, timeframe: str) -> pd.DataFrame | None:
        path = self._path(symbol, timeframe)
        if not path.exists():
            return None
        try:
            return pd.read_parquet(path)
        except Exception:
            return None

    def save(self, symbol: str, timeframe: str, df: pd.DataFrame) -> None:
        path = self._path(symbol, timeframe)
        df.to_parquet(path)

    def merge_and_save(self, symbol: str, timeframe: str, new_df: pd.DataFrame) -> pd.DataFrame:
        existing = self.load(symbol, timeframe)
        if existing is None or existing.empty:
            combined = new_df
        else:
            combined = pd.concat([existing, new_df])
            combined = combined[~combined.index.duplicated(keep="last")].sort_index()
        self.save(symbol, timeframe, combined)
        return combined
