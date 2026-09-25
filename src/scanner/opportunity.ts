import type { CurrencySpread } from "./analyzer.js";

export interface ArbitrageOpportunity {
  asset: string;
  buyFiat: string;
  buyPrice: number;
  buyImpliedUSD: number;
  sellFiat: string;
  sellPrice: number;
  sellImpliedUSD: number;
  theoreticalProfitPct: number;
}

/**
 * Busca, para un activo dado, el pais mas barato para comprarlo (en
 * terminos de USD real) y el pais mas caro para venderlo. La diferencia es
 * el arbitraje TEORICO maximo: no descuenta comisiones de Binance, costos ni
 * tiempos de mover el dinero entre paises, ni restricciones legales o de
 * control de cambios que puedan impedirlo en la practica.
 */
export function findBestOpportunity(asset: string, results: CurrencySpread[]): ArbitrageOpportunity | null {
  const candidates = results.filter(
    (r) => r.asset === asset && r.impliedBuyUSD !== null && r.impliedSellUSD !== null,
  );
  if (candidates.length < 2) return null;

  const cheapest = candidates.reduce((a, b) => (a.impliedBuyUSD! < b.impliedBuyUSD! ? a : b));
  const priciest = candidates.reduce((a, b) => (a.impliedSellUSD! > b.impliedSellUSD! ? a : b));
  if (cheapest.fiat === priciest.fiat) return null;

  const theoreticalProfitPct =
    ((priciest.impliedSellUSD! - cheapest.impliedBuyUSD!) / cheapest.impliedBuyUSD!) * 100;
  if (theoreticalProfitPct <= 0) return null;

  return {
    asset,
    buyFiat: cheapest.fiat,
    buyPrice: cheapest.bestBuyPrice,
    buyImpliedUSD: cheapest.impliedBuyUSD!,
    sellFiat: priciest.fiat,
    sellPrice: priciest.bestSellPrice,
    sellImpliedUSD: priciest.impliedSellUSD!,
    theoreticalProfitPct,
  };
}

export function findAllOpportunities(assets: string[], results: CurrencySpread[]): ArbitrageOpportunity[] {
  return assets
    .map((asset) => findBestOpportunity(asset, results))
    .filter((o): o is ArbitrageOpportunity => o !== null)
    .sort((a, b) => b.theoreticalProfitPct - a.theoreticalProfitPct);
}
