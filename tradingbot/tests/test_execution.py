import pytest

from tradingbot.engine.execution import ExecutionModel


def test_buy_fills_above_reference_price():
    ex = ExecutionModel(fee_bps=10, slippage_bps=5)
    fill = ex.fill_price(100.0, is_buy=True)
    assert fill > 100.0
    assert fill == pytest.approx(100.0 * 1.0005)


def test_sell_fills_below_reference_price():
    ex = ExecutionModel(fee_bps=10, slippage_bps=5)
    fill = ex.fill_price(100.0, is_buy=False)
    assert fill < 100.0
    assert fill == pytest.approx(100.0 * 0.9995)


def test_zero_slippage_means_exact_fill():
    ex = ExecutionModel(fee_bps=10, slippage_bps=0)
    assert ex.fill_price(100.0, is_buy=True) == 100.0
    assert ex.fill_price(100.0, is_buy=False) == 100.0


def test_fee_is_proportional_to_notional():
    ex = ExecutionModel(fee_bps=10, slippage_bps=0)
    assert ex.fee(1000.0) == pytest.approx(1.0)


def test_negative_bps_rejected():
    with pytest.raises(ValueError):
        ExecutionModel(fee_bps=-1, slippage_bps=0)
    with pytest.raises(ValueError):
        ExecutionModel(fee_bps=0, slippage_bps=-1)
