from .base import Strategy, Signal
from .sma_crossover import SmaCrossoverStrategy
from .ema_crossover import EmaCrossoverStrategy
from .rsi_reversion import RsiReversionStrategy
from .bollinger_bands import BollingerBandsStrategy
from .macd_trend import MacdTrendStrategy
from .grid import GridStrategy

STRATEGY_REGISTRY = {
    "sma_crossover": SmaCrossoverStrategy,
    "ema_crossover": EmaCrossoverStrategy,
    "rsi_reversion": RsiReversionStrategy,
    "bollinger_bands": BollingerBandsStrategy,
    "macd_trend": MacdTrendStrategy,
    "grid": GridStrategy,
}

__all__ = [
    "Strategy",
    "Signal",
    "SmaCrossoverStrategy",
    "EmaCrossoverStrategy",
    "RsiReversionStrategy",
    "BollingerBandsStrategy",
    "MacdTrendStrategy",
    "GridStrategy",
    "STRATEGY_REGISTRY",
]
