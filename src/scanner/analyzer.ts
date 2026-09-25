import { config } from "../config.js";
import { fetchTopAds, type P2pAd } from "./binanceP2pApi.js";
import { getFxRate } from "./fxRates.js";
import { getReferenceUsdPrice } from "./referencePrices.js";

export interface CurrencySpread {
  asset: string;
  fiat: string;
  bestBuyPrice: number; // precio mas barato al que se podria comprar el activo
  bestSellPrice: number; // precio mas alto al que se podria vender
  spreadPct: number; // (bestBuyPrice - bestSellPrice) / bestSellPrice * 100
  fxRate: number | null; // unidades de fiat por 1 USD (tasa real usada)
  fxSource: string | null; // "official", "blue (...)", etc.
  impliedBuyUSD: number | null; // costo real en USD de comprar el activo aca
  impliedSellUSD: number | null; // valor real en USD recibido al vender aca
  premiumPct: number | null; // cuanto por encima/debajo del valor real de mercado cotiza el activo aca
}

export interface ScanError {
  asset: string;
  fiat: string;
  error: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * De los anuncios devueltos (ya vienen ordenados por precio), se descartan
 * los de comerciantes con mala reputacion y los que no podrian cubrir el
 * monto de operacion configurado (SCAN_TRADE_AMOUNT_USD). Si el filtro deja
 * la lista vacia, se usa la lista completa igual: preferimos un precio
 * "optimista" a no reportar nada para esa moneda.
 */
function pickBestAd(ads: P2pAd[], desiredAmountLocal: number | null): P2pAd | null {
  const byReputation = ads.filter(
    (ad) => ad.completionRate === null || ad.completionRate >= config.scanMinCompletionRate,
  );

  const filtered =
    desiredAmountLocal !== null
      ? byReputation.filter((ad) => desiredAmountLocal >= ad.minAmount && desiredAmountLocal <= ad.maxAmount)
      : byReputation;

  const pool = filtered.length > 0 ? filtered : byReputation.length > 0 ? byReputation : ads;
  return pool[0] ?? null;
}

export async function scanCurrency(asset: string, fiat: string): Promise<CurrencySpread | ScanError> {
  try {
    const [sellAds, buyAds] = await Promise.all([
      fetchTopAds(asset, fiat, "BUY"), // gente vendiendo -> lo que vos pagarias
      fetchTopAds(asset, fiat, "SELL"), // gente comprando -> lo que vos recibirias
    ]);

    if (sellAds.length === 0 || buyAds.length === 0) {
      return { asset, fiat, error: "sin anuncios activos" };
    }

    const fx = await getFxRate(fiat).catch(() => null);
    const desiredAmountLocal = fx ? config.scanTradeAmountUsd * fx.rate : null;

    const bestBuyAd = pickBestAd(sellAds, desiredAmountLocal);
    const bestSellAd = pickBestAd(buyAds, desiredAmountLocal);
    if (!bestBuyAd || !bestSellAd) {
      return { asset, fiat, error: "no hay anuncios que cumplan los filtros de monto/reputacion" };
    }

    const bestBuyPrice = bestBuyAd.price;
    const bestSellPrice = bestSellAd.price;
    const spreadPct = ((bestBuyPrice - bestSellPrice) / bestSellPrice) * 100;

    let impliedBuyUSD: number | null = null;
    let impliedSellUSD: number | null = null;
    let premiumPct: number | null = null;

    if (fx) {
      const refUsd = await getReferenceUsdPrice(asset);
      impliedBuyUSD = bestBuyPrice / fx.rate;
      impliedSellUSD = bestSellPrice / fx.rate;
      if (refUsd) {
        const midImpliedUSD = (impliedBuyUSD + impliedSellUSD) / 2;
        premiumPct = (midImpliedUSD / refUsd - 1) * 100;
      }
    }

    return {
      asset,
      fiat,
      bestBuyPrice,
      bestSellPrice,
      spreadPct,
      fxRate: fx?.rate ?? null,
      fxSource: fx?.source ?? null,
      impliedBuyUSD,
      impliedSellUSD,
      premiumPct,
    };
  } catch (err) {
    return { asset, fiat, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function scanAll(
  assets: string[],
  fiats: string[],
  delayBetweenMs = config.scanRequestDelayMs,
): Promise<{ results: CurrencySpread[]; errors: ScanError[] }> {
  const results: CurrencySpread[] = [];
  const errors: ScanError[] = [];

  for (const asset of assets) {
    for (const fiat of fiats) {
      const outcome = await scanCurrency(asset, fiat);
      if ("error" in outcome) {
        errors.push(outcome);
      } else {
        results.push(outcome);
      }
      await sleep(delayBetweenMs); // no golpear los endpoints todos juntos
    }
  }

  results.sort((a, b) => (b.premiumPct ?? b.spreadPct) - (a.premiumPct ?? a.spreadPct));
  return { results, errors };
}
