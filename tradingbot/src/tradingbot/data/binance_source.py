"""Historical OHLCV data pulled from Binance's public market-data endpoints
via ccxt. No API key is required for candle history (it is public data).

This module NEVER places orders -- it only calls ccxt's `fetch_ohlcv`, a
read-only, unauthenticated endpoint. Import fails gracefully (see
`data/__init__.py`) if ccxt is not installed, since it is an optional
dependency -- CSV and synthetic sources work without it.
"""

from __future__ import annotations

import time
from datetime import datetime, timezone

import ccxt
import pandas as pd

from .base import MarketDataSource
from .cache import OhlcvCache

_MS_PER_UNIT = {
    "m": 60_000,
    "h": 60 * 60_000,
    "d": 24 * 60 * 60_000,
    "w": 7 * 24 * 60 * 60_000,
}


def _timeframe_to_ms(timeframe: str) -> int:
    unit = timeframe[-1]
    if unit not in _MS_PER_UNIT:
        raise ValueError(f"Unsupported timeframe '{timeframe}'.")
    return int(timeframe[:-1]) * _MS_PER_UNIT[unit]


class BinanceDataSource(MarketDataSource):
    """Fetches (and caches) historical klines from Binance spot markets."""

    def __init__(
        self,
        use_cache: bool = True,
        cache_dir: str | None = None,
        request_pause_s: float = 0.25,
        max_candles_per_request: int = 1000,
    ) -> None:
        self.exchange = ccxt.binance({"enableRateLimit": True})
        self.use_cache = use_cache
        self.cache = OhlcvCache(cache_dir) if use_cache and cache_dir else (OhlcvCache() if use_cache else None)
        self.request_pause_s = request_pause_s
        self.max_candles_per_request = max_candles_per_request

    def get_ohlcv(
        self,
        symbol: str,
        timeframe: str,
        start: datetime,
        end: datetime,
    ) -> pd.DataFrame:
        if start.tzinfo is None:
            start = start.replace(tzinfo=timezone.utc)
        if end.tzinfo is None:
            end = end.replace(tzinfo=timezone.utc)

        cached = self.cache.load(symbol, timeframe) if self.cache else None

        fetch_start = start
        if cached is not None and not cached.empty:
            covered_start, covered_end = cached.index.min(), cached.index.max()
            if covered_start <= start and covered_end >= end:
                return cached.loc[(cached.index >= start) & (cached.index <= end)]
            if covered_end >= start:
                fetch_start = covered_end

        fresh = self._fetch_range(symbol, timeframe, fetch_start, end)

        if self.cache:
            combined = self.cache.merge_and_save(symbol, timeframe, fresh)
        else:
            combined = pd.concat([cached, fresh]) if cached is not None else fresh
            combined = combined[~combined.index.duplicated(keep="last")].sort_index()

        return combined.loc[(combined.index >= start) & (combined.index <= end)]

    def _fetch_range(self, symbol: str, timeframe: str, start: datetime, end: datetime) -> pd.DataFrame:
        tf_ms = _timeframe_to_ms(timeframe)
        since = int(start.timestamp() * 1000)
        end_ms = int(end.timestamp() * 1000)

        rows: list[list[float]] = []
        while since <= end_ms:
            batch = self.exchange.fetch_ohlcv(
                symbol, timeframe=timeframe, since=since, limit=self.max_candles_per_request
            )
            if not batch:
                break
            rows.extend(batch)
            last_ts = batch[-1][0]
            next_since = last_ts + tf_ms
            if next_since <= since:
                break
            since = next_since
            if len(batch) < self.max_candles_per_request:
                break
            time.sleep(self.request_pause_s)

        if not rows:
            raise ValueError(
                f"Binance returned no candles for {symbol} {timeframe} in "
                f"[{start}, {end}]. Check the symbol/timeframe or your network access."
            )

        df = pd.DataFrame(rows, columns=["ts", "open", "high", "low", "close", "volume"])
        df["ts"] = pd.to_datetime(df["ts"], unit="ms", utc=True)
        df = df.set_index("ts")
        return self.validate(df)
