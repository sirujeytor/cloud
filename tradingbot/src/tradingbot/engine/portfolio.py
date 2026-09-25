"""Portfolio state: cash, open position, trade log, and equity curve."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime

import pandas as pd


@dataclass
class Trade:
    """A completed round-trip (entry -> exit) trade."""

    side: str  # "long" or "short"
    entry_time: datetime
    entry_price: float
    quantity: float
    exit_time: datetime | None = None
    exit_price: float | None = None
    exit_reason: str | None = None  # "signal", "stop_loss", "take_profit", "end_of_data"
    entry_fee: float = 0.0
    exit_fee: float = 0.0

    @property
    def is_open(self) -> bool:
        return self.exit_time is None

    @property
    def pnl(self) -> float:
        if self.exit_price is None:
            return 0.0
        direction = 1 if self.side == "long" else -1
        gross = direction * (self.exit_price - self.entry_price) * self.quantity
        return gross - self.entry_fee - self.exit_fee

    @property
    def pnl_pct(self) -> float:
        notional = self.entry_price * self.quantity
        if notional == 0:
            return 0.0
        return self.pnl / notional

    @property
    def holding_period(self):
        if self.exit_time is None:
            return None
        return self.exit_time - self.entry_time


class Portfolio:
    """Tracks cash, the (single) open position, and realized/unrealized P&L.

    Long-only by default (mirrors Binance spot, where you cannot short
    without margin/futures); pass ``allow_short=True`` to also permit short
    positions for strategy research on synthetic/futures-style data.
    """

    def __init__(self, initial_cash: float, allow_short: bool = False):
        if initial_cash <= 0:
            raise ValueError("initial_cash must be positive.")
        self.initial_cash = initial_cash
        self.cash = initial_cash
        self.allow_short = allow_short

        self.position_qty: float = 0.0
        self.open_trade: Trade | None = None
        self.closed_trades: list[Trade] = []

        self._equity_times: list[datetime] = []
        self._equity_values: list[float] = []

    @property
    def side(self) -> int:
        """1 if long, -1 if short, 0 if flat."""
        if self.position_qty > 0:
            return 1
        if self.position_qty < 0:
            return -1
        return 0

    def equity(self, mark_price: float) -> float:
        return self.cash + self.position_qty * mark_price

    def record_equity(self, timestamp: datetime, mark_price: float) -> None:
        self._equity_times.append(timestamp)
        self._equity_values.append(self.equity(mark_price))

    def equity_curve(self) -> pd.Series:
        return pd.Series(self._equity_values, index=pd.DatetimeIndex(self._equity_times), name="equity")

    def open_position(
        self,
        timestamp: datetime,
        price: float,
        quantity: float,
        side: str,
        fee: float,
    ) -> None:
        if side == "short" and not self.allow_short:
            raise ValueError("Shorting is disabled for this portfolio (spot-only mode).")
        if self.open_trade is not None:
            raise RuntimeError("Cannot open a new position while one is already open.")

        signed_qty = quantity if side == "long" else -quantity
        notional = price * quantity
        self.cash -= notional if side == "long" else -notional
        self.cash -= fee

        self.position_qty = signed_qty
        self.open_trade = Trade(
            side=side, entry_time=timestamp, entry_price=price, quantity=quantity, entry_fee=fee
        )

    def close_position(self, timestamp: datetime, price: float, fee: float, reason: str) -> Trade:
        if self.open_trade is None:
            raise RuntimeError("No open position to close.")

        trade = self.open_trade
        notional = price * trade.quantity
        self.cash += notional if trade.side == "long" else -notional
        self.cash -= fee

        trade.exit_time = timestamp
        trade.exit_price = price
        trade.exit_fee = fee
        trade.exit_reason = reason

        self.position_qty = 0.0
        self.open_trade = None
        self.closed_trades.append(trade)
        return trade

    def all_trades(self) -> list[Trade]:
        trades = list(self.closed_trades)
        if self.open_trade is not None:
            trades.append(self.open_trade)
        return trades
