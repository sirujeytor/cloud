"""Strategy interface.

A strategy's only job is to look at historical OHLCV data and decide, for
each bar, what stance it *wants* to hold: long (+1), flat (0), or -- if the
backtest config allows shorting -- short (-1). It must not, and structurally
cannot by using only ``df`` up to the current row, know the future: the
:class:`~tradingbot.engine.backtester.Backtester` shifts the returned series
by one bar before executing on it, so signals are always realized at the
*next* bar's open.

Subclasses only need to implement :meth:`generate_signals`.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Literal

import pandas as pd

Signal = Literal[-1, 0, 1]


class Strategy(ABC):
    name: str = "base"

    @abstractmethod
    def generate_signals(self, df: pd.DataFrame) -> pd.Series:
        """Return a Series indexed like ``df`` with values in {-1, 0, 1}.

        Implementations must be careful to only use ``df.loc[:t]`` when
        computing the value at index ``t`` -- i.e. rolling/expanding windows
        and ``.shift()`` where needed, never a centered or backward-looking
        transform that peeks ahead.
        """
        raise NotImplementedError

    def __repr__(self) -> str:  # pragma: no cover - cosmetic
        params = ", ".join(f"{k}={v!r}" for k, v in vars(self).items())
        return f"{self.__class__.__name__}({params})"
