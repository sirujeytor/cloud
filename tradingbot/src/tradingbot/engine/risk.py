"""Position sizing and stop-loss / take-profit risk management."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal


@dataclass(frozen=True)
class PositionSizer:
    """Decides how much capital to commit to a new position.

    method="fixed_fraction": invest ``fraction`` of current equity (default,
        the standard prudent choice -- e.g. 0.2 means risk 20% of equity per
        trade so a string of losers can't wipe the account in one shot).
    method="all_in": invest the entire available equity (aggressive; mirrors
        naive "put it all on the signal" bots -- kept for comparison, not
        recommended for real capital).
    """

    method: Literal["fixed_fraction", "all_in"] = "fixed_fraction"
    fraction: float = 0.2

    def __post_init__(self):
        if self.method == "fixed_fraction" and not (0 < self.fraction <= 1):
            raise ValueError("fraction must be in (0, 1] for fixed_fraction sizing.")

    def size(self, equity: float, price: float) -> float:
        if price <= 0:
            raise ValueError("price must be positive.")
        capital = equity if self.method == "all_in" else equity * self.fraction
        return capital / price


@dataclass(frozen=True)
class RiskManager:
    """Optional per-trade stop-loss / take-profit, checked against each bar's
    high/low (not just the close) so a wick that pierces the stop intrabar is
    not missed -- a common and important source of backtest optimism when
    people only check closing prices.

    If both the stop and the target are hit within the same bar, the stop is
    assumed to trigger first (the conservative assumption, since we cannot
    know the true intrabar path order from OHLC data alone).
    """

    stop_loss_pct: float | None = None
    take_profit_pct: float | None = None

    def __post_init__(self):
        if self.stop_loss_pct is not None and not (0 < self.stop_loss_pct < 1):
            raise ValueError("stop_loss_pct must be in (0, 1).")
        if self.take_profit_pct is not None and self.take_profit_pct <= 0:
            raise ValueError("take_profit_pct must be positive.")

    def levels(self, entry_price: float, side: str) -> tuple[float | None, float | None]:
        direction = 1 if side == "long" else -1
        stop = None
        target = None
        if self.stop_loss_pct is not None:
            stop = entry_price * (1 - direction * self.stop_loss_pct)
        if self.take_profit_pct is not None:
            target = entry_price * (1 + direction * self.take_profit_pct)
        return stop, target

    def check_bar(
        self, side: str, stop: float | None, target: float | None, bar_high: float, bar_low: float
    ) -> tuple[str | None, float | None]:
        """Returns (reason, exit_price) if the bar's high/low breached a level."""
        if side == "long":
            if stop is not None and bar_low <= stop:
                return "stop_loss", stop
            if target is not None and bar_high >= target:
                return "take_profit", target
        else:
            if stop is not None and bar_high >= stop:
                return "stop_loss", stop
            if target is not None and bar_low <= target:
                return "take_profit", target
        return None, None
