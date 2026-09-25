from __future__ import annotations

import pandas as pd

from .base import Strategy
from .indicators import bollinger_bands


class BollingerBandsStrategy(Strategy):
    """Mean-reversion around Bollinger Bands: buy when price closes below
    the lower band (oversold relative to recent volatility), exit once price
    closes back above the middle band (the moving average)."""

    name = "bollinger_bands"

    def __init__(self, window: int = 20, num_std: float = 2.0):
        self.window = window
        self.num_std = num_std

    def generate_signals(self, df: pd.DataFrame) -> pd.Series:
        lower, mid, _upper = bollinger_bands(df["close"], self.window, self.num_std)
        close = df["close"]
        signal = pd.Series(0, index=df.index, dtype=int)

        in_position = False
        for i in range(len(df)):
            lo, m, c = lower.iloc[i], mid.iloc[i], close.iloc[i]
            if pd.isna(lo) or pd.isna(m):
                signal.iloc[i] = 0
                continue
            if not in_position and c < lo:
                in_position = True
            elif in_position and c > m:
                in_position = False
            signal.iloc[i] = 1 if in_position else 0

        return signal
