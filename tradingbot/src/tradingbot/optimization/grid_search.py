"""Exhaustive parameter grid search with an in-sample/out-of-sample split.

Picking parameters purely on in-sample (train) performance is the single
most common way to fool yourself with a backtester -- with enough parameter
combinations you *will* find one that happened to fit the historical noise.
This function always reports both the training-window metric it optimized
and the same strategy's metric on a held-out test window, so an
overfit combination (great train score, poor test score) is visible instead
of hidden.
"""

from __future__ import annotations

import itertools
from dataclasses import dataclass

import pandas as pd

from ..engine.backtester import Backtester, BacktestConfig
from ..metrics.performance import PerformanceMetrics, compute_metrics
from ..strategies.base import Strategy


@dataclass
class GridSearchResult:
    params: dict
    train_metrics: PerformanceMetrics
    test_metrics: PerformanceMetrics | None

    def train_score(self, metric: str) -> float:
        return getattr(self.train_metrics, metric)

    def test_score(self, metric: str) -> float | None:
        return getattr(self.test_metrics, metric) if self.test_metrics else None


def grid_search(
    df: pd.DataFrame,
    strategy_cls: type[Strategy],
    param_grid: dict[str, list],
    config: BacktestConfig | None = None,
    metric: str = "sharpe_ratio",
    train_frac: float = 0.7,
) -> list[GridSearchResult]:
    if not (0 < train_frac < 1):
        raise ValueError("train_frac must be in (0, 1).")
    if not param_grid:
        raise ValueError("param_grid must have at least one parameter.")

    split_idx = int(len(df) * train_frac)
    train_df, test_df = df.iloc[:split_idx], df.iloc[split_idx:]
    config = config or BacktestConfig()

    keys = list(param_grid.keys())
    value_lists = [param_grid[k] for k in keys]

    results: list[GridSearchResult] = []
    for combo in itertools.product(*value_lists):
        params = dict(zip(keys, combo))
        try:
            strategy = strategy_cls(**params)
        except ValueError:
            continue  # e.g. fast_window >= slow_window -- an invalid combo, not a crash

        try:
            train_result = Backtester(config).run(train_df, strategy)
            train_metrics = compute_metrics(train_result)
        except ValueError:
            continue  # e.g. window too long for the train slice

        test_metrics = None
        if len(test_df) > 5:
            try:
                test_result = Backtester(config).run(test_df, strategy)
                test_metrics = compute_metrics(test_result)
            except ValueError:
                test_metrics = None

        results.append(GridSearchResult(params=params, train_metrics=train_metrics, test_metrics=test_metrics))

    results.sort(key=lambda r: r.train_score(metric), reverse=True)
    return results
