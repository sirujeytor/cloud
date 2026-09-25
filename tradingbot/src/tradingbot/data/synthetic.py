"""Synthetic OHLCV generator.

Useful for unit tests, examples, and sandboxed environments that cannot reach
Binance's API. Prices follow a seeded Geometric Brownian Motion with an
optional drift/volatility regime and occasional jumps, then are folded into
OHLC bars the same way real exchange data is (open = previous close,
high/low = intrabar extremes from a finer-grained random walk).
"""

from __future__ import annotations

from datetime import datetime

import numpy as np
import pandas as pd

from .base import MarketDataSource

_TIMEFRAME_TO_MINUTES = {
    "1m": 1, "3m": 3, "5m": 5, "15m": 15, "30m": 30,
    "1h": 60, "2h": 120, "4h": 240, "6h": 360, "12h": 720,
    "1d": 1440,
}


class SyntheticDataSource(MarketDataSource):
    """Generates a reproducible fake OHLCV series (no network required)."""

    def __init__(
        self,
        seed: int = 42,
        annual_drift: float = 0.15,
        annual_volatility: float = 0.6,
        start_price: float = 100.0,
        jump_prob: float = 0.002,
        jump_scale: float = 0.05,
    ) -> None:
        self.seed = seed
        self.annual_drift = annual_drift
        self.annual_volatility = annual_volatility
        self.start_price = start_price
        self.jump_prob = jump_prob
        self.jump_scale = jump_scale

    def get_ohlcv(
        self,
        symbol: str,
        timeframe: str,
        start: datetime,
        end: datetime,
    ) -> pd.DataFrame:
        if timeframe not in _TIMEFRAME_TO_MINUTES:
            raise ValueError(f"Unsupported timeframe '{timeframe}'.")

        minutes = _TIMEFRAME_TO_MINUTES[timeframe]
        index = pd.date_range(start=start, end=end, freq=f"{minutes}min", tz="UTC")
        if len(index) < 2:
            raise ValueError("Requested range is too short for the given timeframe.")

        # Seed derived from the symbol so different symbols diverge but stay
        # reproducible across runs.
        rng = np.random.default_rng(self.seed + abs(hash(symbol)) % (2**32))

        n = len(index)
        dt = minutes / (365 * 24 * 60)  # fraction of a year per bar
        mu, sigma = self.annual_drift, self.annual_volatility

        # Sub-sample each bar into 8 intrabar steps to derive realistic
        # high/low extremes instead of open==high==low==close.
        sub_steps = 8
        sub_dt = dt / sub_steps
        total_steps = n * sub_steps

        shocks = rng.normal(
            loc=(mu - 0.5 * sigma**2) * sub_dt,
            scale=sigma * np.sqrt(sub_dt),
            size=total_steps,
        )
        jumps = rng.random(total_steps) < (self.jump_prob / sub_steps)
        jump_sizes = rng.normal(0, self.jump_scale, total_steps) * jumps
        log_returns = shocks + jump_sizes

        log_prices = np.log(self.start_price) + np.cumsum(log_returns)
        sub_prices = np.exp(log_prices)
        sub_prices = np.concatenate([[self.start_price], sub_prices])

        opens = sub_prices[0:total_steps:sub_steps]
        closes = sub_prices[sub_steps::sub_steps]
        highs = np.empty(n)
        lows = np.empty(n)
        for i in range(n):
            path = sub_prices[i * sub_steps : (i + 1) * sub_steps + 1]
            highs[i] = path.max()
            lows[i] = path.min()

        volume_base = rng.lognormal(mean=8.0, sigma=0.5, size=n)

        df = pd.DataFrame(
            {
                "open": opens,
                "high": highs,
                "low": lows,
                "close": closes,
                "volume": volume_base,
            },
            index=index,
        )
        return self.validate(df)
