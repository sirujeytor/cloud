from __future__ import annotations

import pandas as pd

from .base import Strategy


class GridStrategy(Strategy):
    """A simplified spot grid: divide the price range [lower, upper] into
    ``num_levels`` bands. Be long whenever price is below the midpoint of
    the range (i.e. in the "buy" half of the grid) and flat above it.

    This is a directional simplification of a real exchange grid bot (which
    holds many small independent buy/sell orders at each level and profits
    from oscillation regardless of trend). It's included so users can compare
    "buy the dip within a range" behavior against the trend-following and
    mean-reversion strategies above, but it will lag a real grid bot's
    performance in a genuinely range-bound, choppy market. Position sizing
    still goes through the engine's PositionSizer, it does not slice the
    grid into per-level orders.
    """

    name = "grid"

    def __init__(self, lower: float, upper: float, num_levels: int = 10):
        if lower >= upper:
            raise ValueError("lower must be < upper.")
        if num_levels < 2:
            raise ValueError("num_levels must be >= 2.")
        self.lower = lower
        self.upper = upper
        self.num_levels = num_levels
        self.midpoint = (lower + upper) / 2

    def generate_signals(self, df: pd.DataFrame) -> pd.Series:
        close = df["close"]
        in_range = (close >= self.lower) & (close <= self.upper)
        signal = ((close < self.midpoint) & in_range).astype(int)
        return signal
