#!/usr/bin/env python3
"""Example: guard against overfitting with a train/test grid search and a
walk-forward analysis, instead of trusting a single full-sample backtest.

Usage:
    python examples/optimize_strategy.py
"""

from datetime import datetime

from tradingbot.data.synthetic import SyntheticDataSource
from tradingbot.engine.backtester import BacktestConfig
from tradingbot.engine.execution import ExecutionModel
from tradingbot.optimization.grid_search import grid_search
from tradingbot.optimization.walk_forward import summarize_walk_forward, walk_forward_analysis
from tradingbot.strategies import SmaCrossoverStrategy

PARAM_GRID = {
    "fast_window": [5, 10, 15, 20],
    "slow_window": [30, 50, 75, 100],
}


def main() -> None:
    source = SyntheticDataSource(seed=123)
    df = source.get_ohlcv("BTC/USDT", "1h", datetime(2023, 1, 1), datetime(2024, 6, 1))

    config = BacktestConfig(initial_cash=100.0, execution=ExecutionModel(fee_bps=10, slippage_bps=5))

    print("=== 1. Single train/test grid search ===")
    results = grid_search(df, SmaCrossoverStrategy, PARAM_GRID, config=config, metric="sharpe_ratio", train_frac=0.7)
    print(f"Evaluated {len(results)} valid parameter combinations.\n")
    for r in results[:5]:
        print(
            f"  {r.params}  train_sharpe={r.train_score('sharpe_ratio'):.2f}  "
            f"test_sharpe={r.test_score('sharpe_ratio'):.2f}"
        )
    best = results[0]
    gap = best.train_score("sharpe_ratio") - (best.test_score("sharpe_ratio") or 0)
    print(f"\nBest by train Sharpe: {best.params} (train/test gap = {gap:.2f})")
    print(
        "A large positive gap here means the 'best' parameters mostly fit "
        "in-sample noise -- don't trust them on their train score alone.\n"
    )

    print("=== 2. Walk-forward analysis (stronger overfitting check) ===")
    windows = walk_forward_analysis(df, SmaCrossoverStrategy, PARAM_GRID, config=config, n_windows=5)
    for w in windows:
        oos = getattr(w.test_metrics, "sharpe_ratio") if w.test_metrics else None
        print(f"  window {w.window_index}: best={w.best_params}  out-of-sample Sharpe={oos}")

    summary = summarize_walk_forward(windows, metric="sharpe_ratio")
    print(f"\nOut-of-sample Sharpe across windows: {summary}")
    if summary["positive_fraction"] is not None:
        verdict = "generalizes reasonably" if summary["positive_fraction"] >= 0.5 else "does NOT generalize well"
        print(f"Verdict: this strategy family {verdict} on this data -- size real capital accordingly (i.e. cautiously).")


if __name__ == "__main__":
    main()
