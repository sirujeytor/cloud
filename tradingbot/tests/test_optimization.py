from tradingbot.engine.backtester import BacktestConfig
from tradingbot.engine.execution import ExecutionModel
from tradingbot.optimization.grid_search import grid_search
from tradingbot.optimization.walk_forward import summarize_walk_forward, walk_forward_analysis
from tradingbot.strategies import SmaCrossoverStrategy


def test_grid_search_returns_sorted_results_with_train_and_test(synthetic_df):
    config = BacktestConfig(initial_cash=100.0, execution=ExecutionModel(fee_bps=10, slippage_bps=5))
    param_grid = {"fast_window": [5, 10], "slow_window": [20, 40]}

    results = grid_search(synthetic_df, SmaCrossoverStrategy, param_grid, config=config, metric="sharpe_ratio")

    assert len(results) == 4  # all combos are valid (fast < slow every time)
    train_scores = [r.train_score("sharpe_ratio") for r in results]
    assert train_scores == sorted(train_scores, reverse=True)
    assert all(r.test_metrics is not None for r in results)


def test_grid_search_skips_invalid_param_combinations(synthetic_df):
    config = BacktestConfig(initial_cash=100.0)
    # fast_window > slow_window in some combos -- the strategy itself raises
    # ValueError for those, and grid_search must skip rather than crash.
    param_grid = {"fast_window": [10, 50], "slow_window": [20]}

    results = grid_search(synthetic_df, SmaCrossoverStrategy, param_grid, config=config)
    assert len(results) == 1
    assert results[0].params == {"fast_window": 10, "slow_window": 20}


def test_walk_forward_analysis_produces_windows(synthetic_df):
    config = BacktestConfig(initial_cash=100.0)
    param_grid = {"fast_window": [5, 10], "slow_window": [20, 40]}

    windows = walk_forward_analysis(
        synthetic_df, SmaCrossoverStrategy, param_grid, config=config, n_windows=3
    )
    assert len(windows) <= 3
    assert all(w.test_start < w.test_end for w in windows)
    assert all(w.train_end <= w.test_start for w in windows)

    summary = summarize_walk_forward(windows, metric="sharpe_ratio")
    assert summary["n_windows"] == len(windows)
