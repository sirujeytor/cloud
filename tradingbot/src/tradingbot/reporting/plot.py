"""Equity curve + drawdown chart, and a buy/sell markers chart."""

from __future__ import annotations

from pathlib import Path

import matplotlib

matplotlib.use("Agg")  # headless: never try to open a GUI window
import matplotlib.pyplot as plt
import pandas as pd


def plot_equity_curve(result, out_path: str | Path, benchmark: pd.Series | None = None) -> Path:
    """Save a two-panel chart: equity curve (with optional buy&hold
    benchmark overlay) on top, drawdown underneath. Returns the saved path.
    """
    equity = result.equity_curve
    running_max = equity.cummax()
    drawdown = (equity / running_max - 1.0) * 100

    fig, (ax_equity, ax_dd) = plt.subplots(
        2, 1, figsize=(11, 7), sharex=True, gridspec_kw={"height_ratios": [3, 1]}
    )

    ax_equity.plot(equity.index, equity.values, label="Strategy equity", color="#1f77b4", linewidth=1.4)

    if benchmark is not None:
        normalized = benchmark / benchmark.iloc[0] * result.config.initial_cash
        ax_equity.plot(
            normalized.index, normalized.values, label="Buy & hold", color="#888888",
            linewidth=1.0, linestyle="--",
        )

    for t in result.closed_trades:
        marker = "^" if t.side == "long" else "v"
        ax_equity.scatter(
            [t.entry_time], [equity.asof(t.entry_time)], marker=marker, color="green", s=30, zorder=5
        )
        if t.exit_time is not None:
            ax_equity.scatter(
                [t.exit_time], [equity.asof(t.exit_time)], marker="x", color="red", s=30, zorder=5
            )

    ax_equity.set_ylabel("Equity")
    ax_equity.set_title("Backtest equity curve")
    ax_equity.legend(loc="upper left")
    ax_equity.grid(alpha=0.3)

    ax_dd.fill_between(drawdown.index, drawdown.values, 0, color="#d62728", alpha=0.4)
    ax_dd.set_ylabel("Drawdown (%)")
    ax_dd.set_xlabel("Time")
    ax_dd.grid(alpha=0.3)

    fig.tight_layout()
    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(out_path, dpi=130)
    plt.close(fig)
    return out_path
