"""Command-line entry point.

Examples
--------
Backtest a moving-average crossover on fully offline synthetic data (works
with no network access and no API keys):

    tradingbot backtest --source synthetic --symbol BTC/USDT --timeframe 1h \\
        --start 2024-01-01 --end 2024-06-01 --strategy sma_crossover \\
        --params fast_window=10,slow_window=50 --initial-cash 100 \\
        --out-dir reports/sma_demo

Backtest against real historical Binance data (requires the optional 'ccxt'
dependency and outbound network access -- this only reads public candle
history, it never places orders):

    tradingbot backtest --source binance --symbol BTC/USDT --timeframe 1h \\
        --start 2023-01-01 --end 2024-01-01 --strategy rsi_reversion \\
        --params window=14,oversold=30,exit_level=55 --out-dir reports/rsi

Grid-search parameters with an in-sample/out-of-sample split:

    tradingbot optimize --source synthetic --symbol BTC/USDT --timeframe 1h \\
        --start 2024-01-01 --end 2024-06-01 --strategy sma_crossover \\
        --param-grid '{"fast_window": [5, 10, 20], "slow_window": [30, 50, 100]}' \\
        --walk-forward
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path

from .data.csv_source import CSVDataSource
from .data.synthetic import SyntheticDataSource
from .engine.backtester import Backtester, BacktestConfig
from .engine.execution import ExecutionModel
from .engine.risk import PositionSizer, RiskManager
from .metrics.performance import compute_metrics
from .optimization.grid_search import grid_search
from .optimization.walk_forward import summarize_walk_forward, walk_forward_analysis
from .reporting.plot import plot_equity_curve
from .reporting.report import build_html_report, build_text_report
from .strategies import STRATEGY_REGISTRY


def _parse_date(value: str) -> datetime:
    return datetime.fromisoformat(value)


def _parse_params(raw: str | None) -> dict:
    if not raw:
        return {}
    params = {}
    for pair in raw.split(","):
        key, _, value = pair.partition("=")
        key, value = key.strip(), value.strip()
        for caster in (int, float):
            try:
                params[key] = caster(value)
                break
            except ValueError:
                continue
        else:
            params[key] = value
    return params


def _build_data_source(args):
    if args.source == "csv":
        if not args.csv_path:
            raise SystemExit("--csv-path is required when --source csv is used.")
        return CSVDataSource(args.csv_path)
    if args.source == "synthetic":
        return SyntheticDataSource(seed=args.seed)
    if args.source == "binance":
        try:
            from .data.binance_source import BinanceDataSource
        except ImportError as exc:
            raise SystemExit(
                "The 'binance' source requires ccxt. Install it with "
                "`pip install ccxt` or `pip install .[binance]`."
            ) from exc
        return BinanceDataSource()
    raise SystemExit(f"Unknown data source: {args.source}")


def _build_config(args) -> BacktestConfig:
    risk = None
    if args.stop_loss_pct or args.take_profit_pct:
        risk = RiskManager(stop_loss_pct=args.stop_loss_pct, take_profit_pct=args.take_profit_pct)
    return BacktestConfig(
        initial_cash=args.initial_cash,
        execution=ExecutionModel(fee_bps=args.fee_bps, slippage_bps=args.slippage_bps),
        position_sizer=PositionSizer(method=args.sizing_method, fraction=args.position_fraction),
        risk_manager=risk,
        allow_short=args.allow_short,
    )


def _add_common_data_args(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--source", choices=["binance", "csv", "synthetic"], default="synthetic")
    parser.add_argument("--symbol", default="BTC/USDT")
    parser.add_argument("--timeframe", default="1h")
    parser.add_argument("--start", type=_parse_date, required=True)
    parser.add_argument("--end", type=_parse_date, required=True)
    parser.add_argument("--csv-path", default=None)
    parser.add_argument("--seed", type=int, default=42, help="Seed for --source synthetic.")


def _add_common_backtest_args(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--strategy", choices=sorted(STRATEGY_REGISTRY.keys()), required=True)
    parser.add_argument("--initial-cash", type=float, default=100.0)
    parser.add_argument("--fee-bps", type=float, default=10.0)
    parser.add_argument("--slippage-bps", type=float, default=5.0)
    parser.add_argument("--sizing-method", choices=["fixed_fraction", "all_in"], default="fixed_fraction")
    parser.add_argument("--position-fraction", type=float, default=0.2)
    parser.add_argument("--stop-loss-pct", type=float, default=None)
    parser.add_argument("--take-profit-pct", type=float, default=None)
    parser.add_argument("--allow-short", action="store_true")


def cmd_backtest(args) -> int:
    source = _build_data_source(args)
    df = source.get_ohlcv(args.symbol, args.timeframe, args.start, args.end)

    strategy_cls = STRATEGY_REGISTRY[args.strategy]
    params = _parse_params(args.params)
    strategy = strategy_cls(**params)

    config = _build_config(args)
    result = Backtester(config).run(df, strategy)
    metrics = compute_metrics(result)

    title = f"{args.strategy} on {args.symbol} ({args.timeframe}, {args.start.date()} to {args.end.date()})"
    print(build_text_report(metrics, title=title))

    if args.out_dir:
        out_dir = Path(args.out_dir)
        out_dir.mkdir(parents=True, exist_ok=True)
        chart_path = plot_equity_curve(result, out_dir / "equity_curve.png", benchmark=df["close"])
        html = build_html_report(metrics, title=title, chart_path=str(chart_path))
        (out_dir / "report.html").write_text(html)
        print(f"Saved chart to {chart_path}")
        print(f"Saved HTML report to {out_dir / 'report.html'}")

    return 0


def cmd_optimize(args) -> int:
    source = _build_data_source(args)
    df = source.get_ohlcv(args.symbol, args.timeframe, args.start, args.end)

    strategy_cls = STRATEGY_REGISTRY[args.strategy]
    param_grid = json.loads(args.param_grid)
    config = _build_config(args)

    if args.walk_forward:
        windows = walk_forward_analysis(
            df, strategy_cls, param_grid, config=config, metric=args.metric,
            n_windows=args.n_windows, train_frac=args.train_frac,
        )
        summary = summarize_walk_forward(windows, metric=args.metric)
        print(f"Walk-forward analysis: {len(windows)} windows evaluated.\n")
        for w in windows:
            oos = getattr(w.test_metrics, args.metric) if w.test_metrics else None
            print(
                f"  Window {w.window_index}: train [{w.train_start.date()} -> {w.train_end.date()}] "
                f"best_params={w.best_params} | test [{w.test_start.date()} -> {w.test_end.date()}] "
                f"out-of-sample {args.metric}={oos}"
            )
        print(f"\nOut-of-sample {args.metric} summary: {summary}")
        if summary["mean"] is not None and summary["positive_fraction"] is not None and summary["positive_fraction"] < 0.5:
            print(
                "\nWarning: fewer than half of the out-of-sample windows had a positive "
                f"{args.metric}. This parameter set does not generalize well and is at risk "
                "of overfitting -- treat any single-split 'good' backtest with caution."
            )
        return 0

    results = grid_search(df, strategy_cls, param_grid, config=config, metric=args.metric, train_frac=args.train_frac)
    if not results:
        print("No valid parameter combinations produced a result.")
        return 1

    print(f"Top results by train {args.metric} (showing up to 10):\n")
    for r in results[:10]:
        test_score = r.test_score(args.metric)
        print(f"  params={r.params} | train {args.metric}={r.train_score(args.metric):.4f} | test {args.metric}={test_score}")

    best = results[0]
    print(f"\nBest params: {best.params}")
    if best.test_metrics is not None:
        print(build_text_report(best.test_metrics, title="Best params -- OUT-OF-SAMPLE performance"))
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="tradingbot", description="Backtest crypto trading strategies offline.")
    subparsers = parser.add_subparsers(dest="command", required=True)

    bt = subparsers.add_parser("backtest", help="Run a single backtest.")
    _add_common_data_args(bt)
    _add_common_backtest_args(bt)
    bt.add_argument("--params", default=None, help="Comma-separated key=value strategy params, e.g. fast_window=10,slow_window=50")
    bt.add_argument("--out-dir", default=None, help="Directory to save an equity chart + HTML report.")
    bt.set_defaults(func=cmd_backtest)

    opt = subparsers.add_parser("optimize", help="Grid-search or walk-forward optimize strategy parameters.")
    _add_common_data_args(opt)
    _add_common_backtest_args(opt)
    opt.add_argument("--param-grid", required=True, help='JSON dict of param -> list of values, e.g. \'{"fast_window": [5, 10]}\'')
    opt.add_argument("--metric", default="sharpe_ratio")
    opt.add_argument("--train-frac", type=float, default=0.7)
    opt.add_argument("--walk-forward", action="store_true")
    opt.add_argument("--n-windows", type=int, default=4)
    opt.set_defaults(func=cmd_optimize)

    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
