from __future__ import annotations

import pandas as pd

from .base import Strategy
from .indicators import rsi


class RsiReversionStrategy(Strategy):
    """Mean-reversion: go long when RSI drops below ``oversold`` (price fell
    too far, too fast) and exit once RSI recovers above ``exit_level``."""

    name = "rsi_reversion"

    def __init__(self, window: int = 14, oversold: float = 30.0, exit_level: float = 55.0):
        if not (0 < oversold < exit_level < 100):
            raise ValueError("Require 0 < oversold < exit_level < 100.")
        self.window = window
        self.oversold = oversold
        self.exit_level = exit_level

    def generate_signals(self, df: pd.DataFrame) -> pd.Series:
        r = rsi(df["close"], self.window)
        signal = pd.Series(0, index=df.index, dtype=int)

        in_position = False
        for i in range(len(df)):
            value = r.iloc[i]
            if pd.isna(value):
                signal.iloc[i] = 0
                continue
            if not in_position and value < self.oversold:
                in_position = True
            elif in_position and value > self.exit_level:
                in_position = False
            signal.iloc[i] = 1 if in_position else 0

        return signal
