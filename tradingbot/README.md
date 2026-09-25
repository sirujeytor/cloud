# tradingbot -- a crypto strategy backtesting framework

An event-driven backtesting engine for researching trading strategies
against Binance-style OHLCV data, built to be honest about costs and risk
rather than to produce flattering numbers.

> **Scope.** This project backtests and paper-trades. **It does not connect
> to Binance to place live orders, and it never touches real funds.** See
> [Why no live trading bot](#why-no-live-trading-bot) below for why that's a
> deliberate choice, not a missing feature.

## What's inside

- **Data layer** (`tradingbot.data`): pull historical candles from Binance
  via `ccxt` (`BinanceDataSource`, public market data only, no API key
  needed), load your own `CSVDataSource`, or generate reproducible fake
  data with `SyntheticDataSource` -- so the whole framework works fully
  offline, with no network access and no exchange account.
- **Backtest engine** (`tradingbot.engine`): a bar-by-bar simulator that
  - executes a signal decided at bar *t*'s close at bar *t+1*'s **open**
    (never on the same bar -- the most common source of inflated backtests),
  - charges a fee and slippage in basis points on every fill,
  - checks stop-loss/take-profit against each bar's **high/low**, not just
    its close, so an intrabar wick isn't silently ignored,
  - sizes positions as a fixed fraction of equity by default (not
    "all-in"), and is long-only by default (matching Binance spot, which
    has no shorting without margin).
- **Strategies** (`tradingbot.strategies`): SMA/EMA crossover, RSI
  mean-reversion, Bollinger Bands, MACD trend, and a simplified grid
  strategy. All are plain, inspectable Python -- read them before trusting
  them.
- **Metrics** (`tradingbot.metrics`): CAGR, Sharpe/Sortino/Calmar, max
  drawdown (+ duration), win rate, profit factor, exposure, fees paid.
- **Reporting** (`tradingbot.reporting`): an equity-curve + drawdown chart
  and a text/HTML report.
- **Optimization** (`tradingbot.optimization`): grid search with a
  train/test split, and walk-forward analysis, both designed to surface
  overfitting instead of hiding it (see below).
- **CLI** (`tradingbot.cli` / the `tradingbot` command): run a backtest or
  an optimization from the terminal.

## Install

```bash
cd tradingbot
pip install -e ".[dev]"        # core + pytest
pip install -e ".[binance]"    # add ccxt, only needed for real Binance data
```

Python 3.10+.

## Quickstart (no network needed)

```bash
python examples/run_backtest.py
python examples/optimize_strategy.py
```

or via the CLI, against the bundled synthetic sample:

```bash
tradingbot backtest \
  --source csv --csv-path examples/sample_data/BTCUSDT_1h_sample.csv \
  --symbol BTC/USDT --timeframe 1h --start 2024-01-01 --end 2024-03-01 \
  --strategy sma_crossover --params fast_window=10,slow_window=50 \
  --initial-cash 100 --out-dir /tmp/tradingbot_report
```

## Using real Binance history

```bash
pip install -e ".[binance]"

tradingbot backtest \
  --source binance --symbol BTC/USDT --timeframe 1h \
  --start 2023-01-01 --end 2024-01-01 \
  --strategy rsi_reversion --params window=14,oversold=30,exit_level=55 \
  --fee-bps 10 --slippage-bps 5 --initial-cash 100 \
  --stop-loss-pct 0.05 --take-profit-pct 0.10 \
  --out-dir /tmp/tradingbot_report
```

`BinanceDataSource` only calls `ccxt`'s public, unauthenticated
`fetch_ohlcv` -- no API key, no order placement, ever. Downloaded candles
are cached to `data_cache/` so repeat backtests don't re-hit the network.

## Guarding against fooling yourself

Two things make home-grown backtests lie to you, and this framework pushes
back on both:

1. **Lookahead bias** -- trading on information from the future. The engine
   always shifts a strategy's signal forward one bar before acting on it,
   and `tests/test_backtester.py` and `tests/test_strategies.py` explicitly
   assert this (truncating the tail of the data must not change earlier
   signals).
2. **Overfitting** -- tuning parameters until they fit historical noise.
   `tradingbot optimize` always reports a held-out test score next to the
   training score, and `--walk-forward` repeats that check across several
   rolling windows, printing a warning when fewer than half the
   out-of-sample windows are profitable. Run
   `python examples/optimize_strategy.py` to see this in action: a
   plausible-looking SMA crossover with a "good" full-sample backtest
   turns out **not** to generalize out-of-sample on that data. That result
   is the point, not a bug -- most simple strategies don't survive fees
   plus real-world noise, and a backtester's job is to tell you that
   *before* you fund it, not after.

## Why no live trading bot

The original ask behind this project was: give a bot $100, connect it to
Binance, and let it scalp/trade on its own. Deliberately not built, for
concrete reasons:

- No scalping/day-trading algorithm reliably "picks the best trades" --
  short-horizon automated strategies are negative-sum after real fees and
  slippage for the large majority of naive approaches, including most of
  the ones in this repo (see the walk-forward results above).
- If the $100 belongs to someone other than the person running the bot,
  autonomously trading it can amount to unregistered funds management in
  many jurisdictions.
- An unattended bot with live order permissions can lose the entire
  balance in hours if a strategy or its parameters are wrong -- and a
  backtest, however careful, can never fully prove a strategy is safe for
  markets it hasn't seen yet.

Use this framework to research and stress-test ideas on historical data.
If you eventually want to paper-trade against Binance's live order book (no
real funds, just watching how a strategy would have performed in real
time), that is a reasonable, much lower-risk next step -- ask for it
explicitly and with a clear head about the jump from "backtest" to "money
at risk."

## Project layout

```
src/tradingbot/
  data/            # BinanceDataSource, CSVDataSource, SyntheticDataSource
  strategies/      # Strategy base class + indicators + bundled strategies
  engine/          # Portfolio, ExecutionModel, RiskManager, Backtester
  metrics/         # compute_metrics -> PerformanceMetrics
  reporting/       # plot_equity_curve, build_text_report, build_html_report
  optimization/    # grid_search, walk_forward_analysis
  cli.py           # `tradingbot backtest` / `tradingbot optimize`
examples/          # runnable scripts + a bundled synthetic sample CSV
tests/             # pytest suite (portfolio, execution, strategies, engine,
                   #  metrics, optimization)
```

## Running the tests

```bash
pip install -e ".[dev]"
pytest -q
```

## Disclaimer

This is a research and educational tool. Nothing it outputs is financial
advice, and no backtest -- however carefully built -- guarantees future
performance. If you ever move from backtesting to trading real capital, do
so with money you can afford to lose, start far smaller than you think you
should, and understand that most of the strategies here (as their own
walk-forward numbers show) do not have a robust, durable edge.
