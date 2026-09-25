from __future__ import annotations

import pandas as pd

from .base import Strategy
from .indicators import macd


class MacdTrendStrategy(Strategy):
    """Trend-following: long while the MACD line is above its signal line."""

    name = "macd_trend"

    def __init__(self, fast: int = 12, slow: int = 26, signal: int = 9):
        if fast >= slow:
            raise ValueError("fast must be smaller than slow.")
        self.fast = fast
        self.slow = slow
        self.signal = signal

    def generate_signals(self, df: pd.DataFrame) -> pd.Series:
        macd_line, signal_line, _hist = macd(df["close"], self.fast, self.slow, self.signal)
        sig = (macd_line > signal_line).astype(int)
        sig[macd_line.isna() | signal_line.isna()] = 0
        return sig
