"""Walk-forward analysis: re-optimize on a rolling window, then test the
chosen parameters on the immediately following, never-before-seen window.

This is a much stronger check against overfitting than a single train/test
split, because it repeats the "optimize then verify out-of-sample" cycle
across several time periods. A strategy whose walk-forward (test-only)
performance is consistently positive is far more credible than one that
merely backtests well over the full sample.
"""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import pandas as pd

from ..engine.backtester import Backtester, BacktestConfig
from ..metrics.performance import PerformanceMetrics, compute_metrics
from ..strategies.base import Strategy
from .grid_search import grid_search


@dataclass
class WalkForwardWindow:
    window_index: int
    train_start: pd.Timestamp
    train_end: pd.Timestamp
    test_start: pd.Timestamp
    test_end: pd.Timestamp
    best_params: dict
    train_metrics: PerformanceMetrics
    test_metrics: PerformanceMetrics | None


def walk_forward_analysis(
    df: pd.DataFrame,
    strategy_cls: type[Strategy],
    param_grid: dict[str, list],
    config: BacktestConfig | None = None,
    metric: str = "sharpe_ratio",
    n_windows: int = 4,
    train_frac: float = 0.7,
) -> list[WalkForwardWindow]:
    """Splits ``df`` into ``n_windows`` equal, non-overlapping chunks.

    Within each chunk, ``train_frac`` of the bars are used to pick the best
    parameters (via :func:`grid_search`) and the remaining bars in that same
    chunk are the out-of-sample test. Consecutive chunks together cover the
    whole series with no gaps and no overlap.
    """
    if n_windows < 2:
        raise ValueError("n_windows must be >= 2 for walk-forward analysis to mean anything.")
    if not (0 < train_frac < 1):
        raise ValueError("train_frac must be in (0, 1).")

    config = config or BacktestConfig()
    chunk_bounds = np.linspace(0, len(df), n_windows + 1, dtype=int)

    windows: list[WalkForwardWindow] = []
    for i in range(n_windows):
        chunk = df.iloc[chunk_bounds[i] : chunk_bounds[i + 1]]
        if len(chunk) < 20:
            continue  # too short a slice to mean anything, skip rather than crash

        split_idx = int(len(chunk) * train_frac)
        train_chunk, test_chunk = chunk.iloc[:split_idx], chunk.iloc[split_idx:]
        if len(test_chunk) < 5:
            continue

        candidates = grid_search(
            train_chunk, strategy_cls, param_grid, config=config, metric=metric, train_frac=0.999
        )
        if not candidates:
            continue
        best = candidates[0]

        strategy = strategy_cls(**best.params)
        test_metrics = None
        try:
            test_result = Backtester(config).run(test_chunk, strategy)
            test_metrics = compute_metrics(test_result)
        except ValueError:
            pass

        windows.append(
            WalkForwardWindow(
                window_index=i,
                train_start=train_chunk.index[0],
                train_end=train_chunk.index[-1],
                test_start=test_chunk.index[0],
                test_end=test_chunk.index[-1],
                best_params=best.params,
                train_metrics=best.train_metrics,
                test_metrics=test_metrics,
            )
        )

    return windows


def summarize_walk_forward(windows: list[WalkForwardWindow], metric: str = "sharpe_ratio") -> dict:
    """Aggregate out-of-sample scores across all walk-forward windows."""
    test_scores = [getattr(w.test_metrics, metric) for w in windows if w.test_metrics is not None]
    if not test_scores:
        return {"n_windows": 0, "mean": None, "std": None, "positive_fraction": None}
    arr = np.array(test_scores)
    return {
        "n_windows": len(arr),
        "mean": float(arr.mean()),
        "std": float(arr.std(ddof=0)),
        "positive_fraction": float((arr > 0).mean()),
    }
