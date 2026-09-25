"""Text and HTML summary reports for a completed backtest."""

from __future__ import annotations

from pathlib import Path

from tabulate import tabulate

from ..metrics.performance import PerformanceMetrics

_ROWS = [
    ("Initial cash", "initial_cash", "{:.2f}"),
    ("Final equity", "final_equity", "{:.2f}"),
    ("Total return", "total_return_pct", "{:.2f}%"),
    ("CAGR", "cagr_pct", "{:.2f}%"),
    ("Annualized volatility", "annualized_volatility_pct", "{:.2f}%"),
    ("Sharpe ratio", "sharpe_ratio", "{:.2f}"),
    ("Sortino ratio", "sortino_ratio", "{:.2f}"),
    ("Calmar ratio", "calmar_ratio", "{:.2f}"),
    ("Max drawdown", "max_drawdown_pct", "{:.2f}%"),
    ("Max drawdown duration", "max_drawdown_duration", "{}"),
    ("Number of trades", "num_trades", "{}"),
    ("Win rate", "win_rate_pct", "{:.2f}%"),
    ("Avg win", "avg_win_pct", "{:.2f}%"),
    ("Avg loss", "avg_loss_pct", "{:.2f}%"),
    ("Profit factor", "profit_factor", "{:.2f}"),
    ("Best trade", "best_trade_pct", "{:.2f}%"),
    ("Worst trade", "worst_trade_pct", "{:.2f}%"),
    ("Avg holding period", "avg_holding_period", "{}"),
    ("Exposure (time in market)", "exposure_pct", "{:.2f}%"),
    ("Total fees paid", "total_fees_paid", "{:.4f}"),
]


def _rows_as_table(metrics: PerformanceMetrics) -> list[tuple[str, str]]:
    data = metrics.as_dict()
    table = []
    for label, key, fmt in _ROWS:
        table.append((label, fmt.format(data[key])))
    return table


def build_text_report(metrics: PerformanceMetrics, title: str = "Backtest Report") -> str:
    table = _rows_as_table(metrics)
    body = tabulate(table, headers=["Metric", "Value"], tablefmt="github")
    return f"{title}\n{'=' * len(title)}\n\n{body}\n"


def build_html_report(metrics: PerformanceMetrics, title: str = "Backtest Report", chart_path: str | None = None) -> str:
    table = _rows_as_table(metrics)
    body = tabulate(table, headers=["Metric", "Value"], tablefmt="html")
    chart_html = f'<img src="{Path(chart_path).name}" style="max-width:100%;margin-top:1.5em;">' if chart_path else ""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{title}</title>
<style>
  body {{ font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 900px; margin: 2rem auto; color: #1a1a1a; }}
  h1 {{ font-size: 1.4rem; }}
  table {{ border-collapse: collapse; width: 100%; }}
  th, td {{ border: 1px solid #ddd; padding: 6px 12px; text-align: left; }}
  th {{ background: #f4f4f4; }}
  .disclaimer {{ margin-top: 2rem; padding: 1rem; background: #fff3cd; border: 1px solid #ffe08a; border-radius: 6px; font-size: 0.9rem; }}
</style>
</head>
<body>
<h1>{title}</h1>
{body}
{chart_html}
<div class="disclaimer">
  This report is a <strong>historical backtest simulation</strong>, not a
  guarantee of future results. Past performance on this data does not imply
  future profitability, and the fee/slippage model is an approximation of
  real execution costs. No live orders were placed on any exchange.
</div>
</body>
</html>
"""
