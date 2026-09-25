import { fetchJsonWithRetry } from "./httpJson.js";

export interface FxLookup {
  rate: number; // unidades de "fiat" por 1 USD
  source: string; // "official" o el nombre de la fuente alternativa usada
}

interface OpenErApiResponse {
  result: string;
  rates: Record<string, number>;
}

let generalRatesCache: { rates: Record<string, number>; fetchedAt: number } | null = null;
const CACHE_TTL_MS = 55 * 60 * 1000; // un poco menos que el intervalo default de 1 hora

async function fetchGeneralRates(): Promise<Record<string, number>> {
  if (generalRatesCache && Date.now() - generalRatesCache.fetchedAt < CACHE_TTL_MS) {
    return generalRatesCache.rates;
  }
  const data = await fetchJsonWithRetry<OpenErApiResponse>("https://open.er-api.com/v6/latest/USD");
  if (data.result !== "success") {
    throw new Error("El proveedor de tipos de cambio no devolvio datos validos");
  }
  generalRatesCache = { rates: data.rates, fetchedAt: Date.now() };
  return data.rates;
}

/**
 * En paises con control de cambios (Argentina, Venezuela, etc.) la tasa
 * "oficial" no refleja el valor real al que se mueve el dinero, que es
 * justamente la razon por la que existe el arbitraje P2P ahi. Este mapa
 * permite enchufar una fuente alternativa mas realista por moneda. Si no
 * hay override, se usa la tasa oficial de la tabla general.
 */
const overrides: Record<string, () => Promise<FxLookup>> = {
  ARS: async () => {
    const data = await fetchJsonWithRetry<{ blue: { value_sell: number } }>(
      "https://api.bluelytics.com.ar/v2/latest",
    );
    return { rate: data.blue.value_sell, source: "blue (bluelytics.com.ar)" };
  },
};

export async function getFxRate(fiat: string): Promise<FxLookup | null> {
  if (fiat === "USD") return { rate: 1, source: "official" };

  const override = overrides[fiat];
  if (override) {
    try {
      return await override();
    } catch {
      // si la fuente alternativa falla, seguimos con la tasa oficial
    }
  }

  try {
    const rates = await fetchGeneralRates();
    const rate = rates[fiat];
    if (!rate) return null;
    return { rate, source: "official" };
  } catch {
    return null;
  }
}
