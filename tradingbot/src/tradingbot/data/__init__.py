from .base import MarketDataSource
from .csv_source import CSVDataSource
from .synthetic import SyntheticDataSource

__all__ = ["MarketDataSource", "CSVDataSource", "SyntheticDataSource"]

try:
    from .binance_source import BinanceDataSource  # noqa: F401

    __all__.append("BinanceDataSource")
except ImportError:
    # ccxt is an optional dependency; offline sources still work without it.
    pass
