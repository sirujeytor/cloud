/**
 * Este endpoint es el mismo que usa la pagina web de Binance P2P. No es una
 * API oficial ni documentada: puede cambiar de forma o de URL sin aviso, y
 * Binance puede empezar a bloquear pedidos automatizados en cualquier
 * momento. Es de solo lectura (no requiere login), asi que el riesgo es
 * mucho menor que el del bot de chat, pero no es garantia de nada.
 */
const ENDPOINT = "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search";

export type TradeType = "BUY" | "SELL";

export interface P2pAd {
  price: number;
  minAmount: number;
  maxAmount: number;
  advertiserName: string;
  completionRate: number | null;
}

interface RawAdvResponse {
  code: string;
  data: Array<{
    adv: {
      price: string;
      minSingleTransAmount: string;
      maxSingleTransAmount: string;
    };
    advertiser: {
      nickName: string;
      monthFinishRate: number | null;
    };
  }>;
}

/**
 * Trae los mejores anuncios para un par asset/fiat. tradeType "BUY" busca
 * anuncios de gente vendiendo cripto (o sea, precio al que VOS comprarias).
 * tradeType "SELL" busca anuncios de gente comprando cripto (precio al que
 * VOS venderias).
 */
export async function fetchTopAds(
  asset: string,
  fiat: string,
  tradeType: TradeType,
  rows = 5,
): Promise<P2pAd[]> {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      asset,
      fiat,
      tradeType,
      page: 1,
      rows,
      payTypes: [],
      publisherType: null,
    }),
  });

  if (!response.ok) {
    throw new Error(`Binance P2P respondio ${response.status} para ${fiat}/${tradeType}`);
  }

  const json = (await response.json()) as RawAdvResponse;
  if (json.code !== "000000" || !Array.isArray(json.data)) {
    return [];
  }

  return json.data.map((item) => ({
    price: Number(item.adv.price),
    minAmount: Number(item.adv.minSingleTransAmount),
    maxAmount: Number(item.adv.maxSingleTransAmount),
    advertiserName: item.advertiser.nickName,
    completionRate: item.advertiser.monthFinishRate,
  }));
}
