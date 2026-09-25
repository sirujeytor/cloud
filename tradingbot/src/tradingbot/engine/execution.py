"""Order execution simulation: fees and slippage.

Both are expressed in basis points (1 bp = 0.01%) applied to the fill
notional, matching how exchanges quote taker fees. Slippage is modelled as a
fixed adverse offset applied to the reference price (the bar's open, in this
engine) -- buys fill higher, sells fill lower. This is a simplification of
real order-book slippage (which scales with order size and volatility) but
gives a conservative, deterministic, and easy-to-reason-about estimate that
errs on the side of understating strategy performance rather than
overstating it.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class ExecutionModel:
    fee_bps: float = 10.0  # Binance spot taker fee is ~10 bps (0.10%) without BNB discount
    slippage_bps: float = 5.0

    def __post_init__(self):
        if self.fee_bps < 0 or self.slippage_bps < 0:
            raise ValueError("fee_bps and slippage_bps must be non-negative.")

    def fill_price(self, reference_price: float, is_buy: bool) -> float:
        offset = reference_price * (self.slippage_bps / 10_000)
        return reference_price + offset if is_buy else reference_price - offset

    def fee(self, notional: float) -> float:
        return abs(notional) * (self.fee_bps / 10_000)
