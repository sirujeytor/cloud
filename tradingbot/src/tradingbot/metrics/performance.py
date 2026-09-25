"""Performance metrics computed from a completed backtest.

All ratios are computed from the equity curve's per-bar returns and
annualized using the sampling frequency inferred from the curve's own index
(so the same code works whether you backtested on 1-minute or daily bars).
"""

from __future__ import annotations

from dataclasses import dataclass, asdict

import numpy as np
import pandas as pd

_SECONDS_PER_YEAR = 365.25 * 24 * 60 * 60


@dataclass
class PerformanceMetrics:
    initial_cash: float
    final_equity: float
    total_return_pct: float
    cagr_pct: float
    annualized_volatility_pct: float
    sharpe_ratio: float
    sortino_ratio: float
    calmar_ratio: float
    max_drawdown_pct: float
    max_drawdown_duration: str
    num_trades: int
    win_rate_pct: float
    avg_win_pct: float
    avg_loss_pct: float
    profit_factor: float
    best_trade_pct: float
    worst_trade_pct: float
    avg_holding_period: str
    exposure_pct: float
    total_fees_paid: float

    def as_dict(self) -> dict:
        return asdict(self)


def _infer_periods_per_year(index: pd.DatetimeIndex) -> float:
    if len(index) < 2:
        return 1.0
    deltas = index.to_series().diff().dropna().dt.total_seconds()
    median_delta = deltas.median()
    if median_delta <= 0:
        return 1.0
    return _SECONDS_PER_YEAR / median_delta


def _max_drawdown(equity: pd.Series) -> tuple[float, pd.Timedelta]:
    running_max = equity.cummax()
    drawdown = equity / running_max - 1.0
    max_dd = drawdown.min()

    # Duration of the worst drawdown: from the peak preceding the trough to
    # the point equity recovers back to that peak (or the end of the series
    # if it never recovers).
    trough_idx = drawdown.idxmin()
    peak_idx = equity.loc[:trough_idx].idxmax()
    recovery_slice = equity.loc[trough_idx:]
    peak_value = equity.loc[peak_idx]
    recovered = recovery_slice[recovery_slice >= peak_value]
    recovery_idx = recovered.index[0] if len(recovered) > 0 else equity.index[-1]
    duration = recovery_idx - peak_idx
    return float(max_dd), duration


def compute_metrics(result, risk_free_rate: float = 0.0) -> PerformanceMetrics:
    """``result`` is a :class:`tradingbot.engine.backtester.BacktestResult`."""

    equity = result.equity_curve
    if len(equity) < 2:
        raise ValueError("Equity curve is too short to compute metrics.")

    initial_cash = result.config.initial_cash
    final_equity = float(equity.iloc[-1])
    total_return_pct = (final_equity / initial_cash - 1.0) * 100

    periods_per_year = _infer_periods_per_year(equity.index)
    returns = equity.pct_change().dropna()

    years = (equity.index[-1] - equity.index[0]).total_seconds() / _SECONDS_PER_YEAR
    if years > 0 and final_equity > 0:
        cagr_pct = ((final_equity / initial_cash) ** (1 / years) - 1) * 100
    else:
        cagr_pct = 0.0

    ann_vol = returns.std(ddof=0) * np.sqrt(periods_per_year)
    ann_vol_pct = ann_vol * 100

    period_rf = risk_free_rate / periods_per_year
    excess_returns = returns - period_rf
    sharpe = (
        (excess_returns.mean() / excess_returns.std(ddof=0)) * np.sqrt(periods_per_year)
        if excess_returns.std(ddof=0) > 0
        else 0.0
    )

    downside = excess_returns[excess_returns < 0]
    downside_std = downside.std(ddof=0)
    sortino = (
        (excess_returns.mean() / downside_std) * np.sqrt(periods_per_year)
        if downside_std and downside_std > 0
        else 0.0
    )

    max_dd_pct, max_dd_duration = _max_drawdown(equity)
    max_dd_pct *= 100
    calmar = (cagr_pct / abs(max_dd_pct)) if max_dd_pct != 0 else 0.0

    closed = result.closed_trades
    num_trades = len(closed)
    pnl_pcts = np.array([t.pnl_pct for t in closed]) * 100
    wins = pnl_pcts[pnl_pcts > 0]
    losses = pnl_pcts[pnl_pcts <= 0]

    win_rate_pct = (len(wins) / num_trades * 100) if num_trades else 0.0
    avg_win_pct = float(wins.mean()) if len(wins) else 0.0
    avg_loss_pct = float(losses.mean()) if len(losses) else 0.0

    gross_profit = sum(t.pnl for t in closed if t.pnl > 0)
    gross_loss = abs(sum(t.pnl for t in closed if t.pnl < 0))
    profit_factor = (gross_profit / gross_loss) if gross_loss > 0 else float("inf") if gross_profit > 0 else 0.0

    best_trade_pct = float(pnl_pcts.max()) if num_trades else 0.0
    worst_trade_pct = float(pnl_pcts.min()) if num_trades else 0.0

    holding_periods = [t.holding_period for t in closed if t.holding_period is not None]
    avg_holding = (
        sum(holding_periods, pd.Timedelta(0)) / len(holding_periods)
        if holding_periods
        else pd.Timedelta(0)
    )

    total_bar_time = equity.index[-1] - equity.index[0]
    time_in_market = sum(
        ((t.exit_time or equity.index[-1]) - t.entry_time for t in result.trades),
        pd.Timedelta(0),
    )
    exposure_pct = (
        (time_in_market.total_seconds() / total_bar_time.total_seconds() * 100)
        if total_bar_time.total_seconds() > 0
        else 0.0
    )

    total_fees = sum(t.entry_fee + t.exit_fee for t in result.trades)

    return PerformanceMetrics(
        initial_cash=initial_cash,
        final_equity=final_equity,
        total_return_pct=total_return_pct,
        cagr_pct=cagr_pct,
        annualized_volatility_pct=ann_vol_pct,
        sharpe_ratio=float(sharpe),
        sortino_ratio=float(sortino),
        calmar_ratio=float(calmar),
        max_drawdown_pct=max_dd_pct,
        max_drawdown_duration=str(max_dd_duration),
        num_trades=num_trades,
        win_rate_pct=win_rate_pct,
        avg_win_pct=avg_win_pct,
        avg_loss_pct=avg_loss_pct,
        profit_factor=profit_factor,
        best_trade_pct=best_trade_pct,
        worst_trade_pct=worst_trade_pct,
        avg_holding_period=str(avg_holding),
        exposure_pct=exposure_pct,
        total_fees_paid=float(total_fees),
    )
