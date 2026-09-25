import { fetchJsonWithRetry } from "./httpJson.js";

/**
 * Precio de referencia en USD de un activo (usado para calcular la "prima"
 * del P2P sobre el valor real). Para stablecoins asumimos 1 USD; para BTC/ETH
 * y otros, se consulta el spot publico de Binance (api.binance.com, distinto
 * del endpoint de P2P, sin necesidad de login).
 */
const SPOT_ENDPOINT = "https://api.binance.com/api/v3/ticker/price";
const STABLECOINS = new Set(["USDT", "USDC", "BUSD", "FDUSD", "DAI"]);

const cache = new Map<string, { price: number; fetchedAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function getReferenceUsdPrice(asset: string): Promise<number | null> {
  if (STABLECOINS.has(asset)) return 1;

  const cached = cache.get(asset);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) return cached.price;

  try {
    const symbol = `${asset}USDT`;
    const data = await fetchJsonWithRetry<{ price: string }>(`${SPOT_ENDPOINT}?symbol=${symbol}`);
    const price = Number(data.price);
    if (!Number.isFinite(price) || price <= 0) return null;
    cache.set(asset, { price, fetchedAt: Date.now() });
    return price;
  } catch {
    return null;
  }
}
