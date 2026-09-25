from __future__ import annotations

import pandas as pd

from .base import Strategy
from .indicators import sma


class SmaCrossoverStrategy(Strategy):
    """Classic trend-following crossover: long while the fast SMA is above
    the slow SMA, flat otherwise."""

    name = "sma_crossover"

    def __init__(self, fast_window: int = 10, slow_window: int = 50):
        if fast_window >= slow_window:
            raise ValueError("fast_window must be smaller than slow_window.")
        self.fast_window = fast_window
        self.slow_window = slow_window

    def generate_signals(self, df: pd.DataFrame) -> pd.Series:
        fast = sma(df["close"], self.fast_window)
        slow = sma(df["close"], self.slow_window)
        signal = (fast > slow).astype(int)
        signal[fast.isna() | slow.isna()] = 0
        return signal
