"""The core bar-by-bar backtest loop.

Anti-lookahead design
----------------------
A ``Strategy`` computes a *target stance* (-1 short, 0 flat, +1 long) for
each bar using only information available up to and including that bar's
close. The engine then shifts that series forward by one bar before acting
on it: the stance decided at bar *t*'s close is realized as a trade at bar
*t+1*'s open. This mirrors the real constraint that you cannot trade on a
candle's close before it has actually closed, and is the single most common
mistake in home-grown backtesters (accidentally trading on the same bar a
signal was computed from, which silently inflates returns).

Within a bar, order of operations is:
1. If a position is open, check the risk manager's stop-loss/take-profit
   against that bar's high/low first (conservative: stop wins ties).
2. Otherwise, if the (shifted) target stance differs from the current
   position, execute the rebalance at the bar's open price.
3. Mark equity at the bar's close.
"""

from __future__ import annotations

from dataclasses import dataclass, field

import numpy as np
import pandas as pd

from ..strategies.base import Strategy
from .execution import ExecutionModel
from .portfolio import Portfolio, Trade
from .risk import PositionSizer, RiskManager


@dataclass
class BacktestConfig:
    initial_cash: float = 100.0
    execution: ExecutionModel = field(default_factory=ExecutionModel)
    position_sizer: PositionSizer = field(default_factory=PositionSizer)
    risk_manager: RiskManager | None = None
    allow_short: bool = False


@dataclass
class BacktestResult:
    equity_curve: pd.Series
    trades: list[Trade]
    signals: pd.Series
    ohlcv: pd.DataFrame
    config: BacktestConfig

    @property
    def closed_trades(self) -> list[Trade]:
        return [t for t in self.trades if not t.is_open]


class Backtester:
    def __init__(self, config: BacktestConfig | None = None):
        self.config = config or BacktestConfig()

    def run(self, df: pd.DataFrame, strategy: Strategy) -> BacktestResult:
        if df.empty:
            raise ValueError("Cannot backtest on an empty OHLCV frame.")

        raw_signals = strategy.generate_signals(df)
        raw_signals = raw_signals.reindex(df.index).fillna(0)

        allowed = {-1, 0, 1} if self.config.allow_short else {0, 1}
        bad_values = set(np.unique(raw_signals.values)) - allowed
        if bad_values:
            raise ValueError(
                f"Strategy '{strategy.__class__.__name__}' produced signal values "
                f"{sorted(bad_values)} outside the allowed set {sorted(allowed)}. "
                "Signals must be -1/0/1 (short/flat/long); enable allow_short=True "
                "in BacktestConfig to permit -1."
            )

        # Shift by one bar: a decision made using bar t's close data is acted
        # on at bar t+1's open. The first bar therefore always starts flat.
        target = raw_signals.shift(1).fillna(0)

        portfolio = Portfolio(self.config.initial_cash, allow_short=self.config.allow_short)
        execution = self.config.execution
        sizer = self.config.position_sizer
        risk = self.config.risk_manager

        opens = df["open"].to_numpy()
        highs = df["high"].to_numpy()
        lows = df["low"].to_numpy()
        closes = df["close"].to_numpy()
        timestamps = df.index

        for i in range(len(df)):
            ts = timestamps[i]
            bar_open, bar_high, bar_low, bar_close = opens[i], highs[i], lows[i], closes[i]

            risk_exit_done = False
            if portfolio.open_trade is not None and risk is not None:
                stop, tgt = risk.levels(portfolio.open_trade.entry_price, portfolio.open_trade.side)
                reason, level = risk.check_bar(portfolio.open_trade.side, stop, tgt, bar_high, bar_low)
                if reason:
                    is_buy = portfolio.open_trade.side == "short"  # closing a short means buying back
                    fill = execution.fill_price(level, is_buy)
                    fee = execution.fee(fill * portfolio.open_trade.quantity)
                    portfolio.close_position(ts, fill, fee, reason)
                    risk_exit_done = True

            if not risk_exit_done:
                desired = int(target.iloc[i])
                if desired != portfolio.side:
                    if portfolio.open_trade is not None:
                        is_buy = portfolio.open_trade.side == "short"
                        fill = execution.fill_price(bar_open, is_buy)
                        fee = execution.fee(fill * portfolio.open_trade.quantity)
                        portfolio.close_position(ts, fill, fee, "signal")

                    if desired != 0:
                        side = "long" if desired > 0 else "short"
                        is_buy = side == "long"
                        fill = execution.fill_price(bar_open, is_buy)
                        equity_now = portfolio.equity(bar_open)
                        qty = sizer.size(equity_now, fill)
                        if side == "long":
                            fee_rate = execution.fee_bps / 10_000
                            max_affordable_qty = portfolio.cash / (fill * (1 + fee_rate))
                            qty = min(qty, max_affordable_qty)
                        if qty > 0:
                            fee = execution.fee(fill * qty)
                            portfolio.open_position(ts, fill, qty, side, fee)

            portfolio.record_equity(ts, bar_close)

        if portfolio.open_trade is not None:
            last_ts = timestamps[-1]
            last_close = closes[-1]
            is_buy = portfolio.open_trade.side == "short"
            fill = execution.fill_price(last_close, is_buy)
            fee = execution.fee(fill * portfolio.open_trade.quantity)
            portfolio.close_position(last_ts, fill, fee, "end_of_data")
            portfolio._equity_values[-1] = portfolio.equity(last_close)

        return BacktestResult(
            equity_curve=portfolio.equity_curve(),
            trades=portfolio.all_trades(),
            signals=raw_signals,
            ohlcv=df,
            config=self.config,
        )
