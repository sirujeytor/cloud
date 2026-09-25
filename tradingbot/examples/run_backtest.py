#!/usr/bin/env python3
"""Minimal end-to-end example: backtest a strategy and print/plot results.

Runs entirely offline against synthetic data, so it works with no network
access and no Binance account. Swap ``SyntheticDataSource`` for
``BinanceDataSource`` (see the commented block below) to backtest against
real historical prices once you have network access.

Usage:
    python examples/run_backtest.py
"""

from datetime import datetime
from pathlib import Path

from tradingbot.data.synthetic import SyntheticDataSource
from tradingbot.engine.backtester import Backtester, BacktestConfig
from tradingbot.engine.execution import ExecutionModel
from tradingbot.engine.risk import PositionSizer, RiskManager
from tradingbot.metrics.performance import compute_metrics
from tradingbot.reporting.plot import plot_equity_curve
from tradingbot.reporting.report import build_html_report, build_text_report
from tradingbot.strategies import SmaCrossoverStrategy

OUT_DIR = Path(__file__).parent / "output"


def main() -> None:
    # --- 1. Get data -------------------------------------------------------
    source = SyntheticDataSource(seed=42)
    df = source.get_ohlcv(
        symbol="BTC/USDT",
        timeframe="1h",
        start=datetime(2024, 1, 1),
        end=datetime(2024, 7, 1),
    )

    # To use real Binance history instead (requires `pip install ccxt` and
    # network access), swap the block above for:
    #
    #   from tradingbot.data.binance_source import BinanceDataSource
    #   source = BinanceDataSource()
    #   df = source.get_ohlcv("BTC/USDT", "1h", datetime(2023, 1, 1), datetime(2024, 1, 1))

    # --- 2. Pick a strategy --------------------------------------------------
    strategy = SmaCrossoverStrategy(fast_window=10, slow_window=50)

    # --- 3. Configure realistic costs and risk controls ---------------------
    config = BacktestConfig(
        initial_cash=100.0,  # the "$100 to trade with" scenario
        execution=ExecutionModel(fee_bps=10, slippage_bps=5),  # Binance-ish taker fee + slippage
        position_sizer=PositionSizer(method="fixed_fraction", fraction=0.2),  # risk 20% of equity per trade
        risk_manager=RiskManager(stop_loss_pct=0.05, take_profit_pct=0.10),
    )

    # --- 4. Run the backtest -------------------------------------------------
    result = Backtester(config).run(df, strategy)
    metrics = compute_metrics(result)

    # --- 5. Report -------------------------------------------------------------
    title = f"{strategy.name} on synthetic BTC/USDT 1h"
    print(build_text_report(metrics, title=title))

    OUT_DIR.mkdir(exist_ok=True)
    chart_path = plot_equity_curve(result, OUT_DIR / "equity_curve.png", benchmark=df["close"])
    html = build_html_report(metrics, title=title, chart_path=str(chart_path))
    (OUT_DIR / "report.html").write_text(html)
    print(f"\nSaved chart to {chart_path}")
    print(f"Saved HTML report to {OUT_DIR / 'report.html'}")


if __name__ == "__main__":
    main()
