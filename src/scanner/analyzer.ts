import { fetchTopAds } from "./binanceP2pApi.js";

export interface CurrencySpread {
  fiat: string;
  bestBuyPrice: number; // precio mas barato al que podrias comprar el activo
  bestSellPrice: number; // precio mas alto al que podrias venderlo
  spreadPct: number; // (bestBuyPrice - bestSellPrice) / bestSellPrice * 100
}

export interface ScanError {
  fiat: string;
  error: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * OJO con lo que significa "spread" aca: es la diferencia entre comprar y
 * vender DENTRO del mismo mercado fiat (ida y vuelta). Un spread alto marca
 * un mercado con poca liquidez o muy volatil, no necesariamente una
 * ganancia real (las comisiones y el tiempo de conversion se comen parte).
 *
 * Para arbitraje real entre paises (comprar barato en fiat A, vender caro
 * en fiat B) hace falta ademas una referencia de tipo de cambio real entre
 * A y B, que este scanner todavia no trae (ver README, seria una fase 2).
 */
export async function scanCurrency(asset: string, fiat: string): Promise<CurrencySpread | ScanError> {
  try {
    const [sellAds, buyAds] = await Promise.all([
      fetchTopAds(asset, fiat, "BUY"), // gente vendiendo -> lo que vos pagarias
      fetchTopAds(asset, fiat, "SELL"), // gente comprando -> lo que vos recibirias
    ]);

    if (sellAds.length === 0 || buyAds.length === 0) {
      return { fiat, error: "sin anuncios activos" };
    }

    const bestBuyPrice = sellAds[0].price;
    const bestSellPrice = buyAds[0].price;
    const spreadPct = ((bestBuyPrice - bestSellPrice) / bestSellPrice) * 100;

    return { fiat, bestBuyPrice, bestSellPrice, spreadPct };
  } catch (err) {
    return { fiat, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function scanAllCurrencies(
  asset: string,
  fiats: string[],
  delayBetweenMs = 300,
): Promise<{ results: CurrencySpread[]; errors: ScanError[] }> {
  const results: CurrencySpread[] = [];
  const errors: ScanError[] = [];

  for (const fiat of fiats) {
    const outcome = await scanCurrency(asset, fiat);
    if ("error" in outcome) {
      errors.push(outcome);
    } else {
      results.push(outcome);
    }
    await sleep(delayBetweenMs); // no golpear el endpoint todo junto
  }

  results.sort((a, b) => b.spreadPct - a.spreadPct);
  return { results, errors };
}
