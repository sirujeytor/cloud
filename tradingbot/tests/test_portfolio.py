import pytest

from tradingbot.engine.portfolio import Portfolio


def test_initial_state():
    p = Portfolio(initial_cash=100.0)
    assert p.cash == 100.0
    assert p.position_qty == 0.0
    assert p.side == 0
    assert p.equity(mark_price=50.0) == 100.0


def test_open_and_close_long_updates_cash_and_pnl():
    p = Portfolio(initial_cash=100.0)
    p.open_position(timestamp=0, price=10.0, quantity=2.0, side="long", fee=0.1)

    assert p.cash == pytest.approx(100.0 - 20.0 - 0.1)
    assert p.position_qty == 2.0
    assert p.side == 1

    trade = p.close_position(timestamp=1, price=12.0, fee=0.12, reason="signal")

    assert p.position_qty == 0.0
    assert p.side == 0
    assert trade.pnl == pytest.approx((12.0 - 10.0) * 2.0 - 0.1 - 0.12)
    assert p.cash == pytest.approx(100.0 + trade.pnl)


def test_shorting_disabled_by_default():
    p = Portfolio(initial_cash=100.0, allow_short=False)
    with pytest.raises(ValueError):
        p.open_position(timestamp=0, price=10.0, quantity=1.0, side="short", fee=0.0)


def test_shorting_allowed_when_enabled():
    p = Portfolio(initial_cash=100.0, allow_short=True)
    p.open_position(timestamp=0, price=10.0, quantity=1.0, side="short", fee=0.0)
    assert p.position_qty == -1.0
    assert p.side == -1

    trade = p.close_position(timestamp=1, price=8.0, fee=0.0, reason="signal")
    # Short profits when price falls.
    assert trade.pnl == pytest.approx((10.0 - 8.0) * 1.0)


def test_cannot_open_position_while_one_is_open():
    p = Portfolio(initial_cash=100.0)
    p.open_position(timestamp=0, price=10.0, quantity=1.0, side="long", fee=0.0)
    with pytest.raises(RuntimeError):
        p.open_position(timestamp=1, price=10.0, quantity=1.0, side="long", fee=0.0)


def test_cannot_close_without_open_position():
    p = Portfolio(initial_cash=100.0)
    with pytest.raises(RuntimeError):
        p.close_position(timestamp=0, price=10.0, fee=0.0, reason="signal")
