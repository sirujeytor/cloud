from __future__ import annotations

import pandas as pd

from .base import Strategy
from .indicators import ema


class EmaCrossoverStrategy(Strategy):
    """Like SmaCrossoverStrategy but with exponential moving averages, which
    react faster to recent price changes."""

    name = "ema_crossover"

    def __init__(self, fast_span: int = 12, slow_span: int = 26):
        if fast_span >= slow_span:
            raise ValueError("fast_span must be smaller than slow_span.")
        self.fast_span = fast_span
        self.slow_span = slow_span

    def generate_signals(self, df: pd.DataFrame) -> pd.Series:
        fast = ema(df["close"], self.fast_span)
        slow = ema(df["close"], self.slow_span)
        signal = (fast > slow).astype(int)
        signal[fast.isna() | slow.isna()] = 0
        return signal
