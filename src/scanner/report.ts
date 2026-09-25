import type { CurrencySpread, ScanError } from "./analyzer.js";
import { historyKey } from "./history.js";
import type { ArbitrageOpportunity } from "./opportunity.js";

function metric(r: CurrencySpread): number {
  return r.premiumPct ?? r.spreadPct;
}

function formatOpportunityLine(o: ArbitrageOpportunity): string {
  return (
    `${o.asset}: comprar en ${o.buyFiat} (~$${o.buyImpliedUSD.toFixed(3)} real) ` +
    `y vender en ${o.sellFiat} (~$${o.sellImpliedUSD.toFixed(3)} real) ` +
    `=> ${o.theoreticalProfitPct.toFixed(2)}% teorico`
  );
}

export function formatConsoleReport(
  results: CurrencySpread[],
  errors: ScanError[],
  opportunities: ArbitrageOpportunity[],
): string {
  const lines: string[] = [];
  lines.push(`Escaneo P2P Binance - ${new Date().toLocaleString()}`);
  lines.push("asset\tfiat\tcompra\tventa\tspread%\tpremium%\tfuente FX");
  for (const r of results) {
    lines.push(
      [
        r.asset,
        r.fiat,
        r.bestBuyPrice.toFixed(2),
        r.bestSellPrice.toFixed(2),
        `${r.spreadPct.toFixed(2)}%`,
        r.premiumPct !== null ? `${r.premiumPct.toFixed(2)}%` : "n/d",
        r.fxSource ?? "n/d",
      ].join("\t"),
    );
  }

  if (opportunities.length > 0) {
    lines.push("\nOportunidades de arbitraje real (teoricas, antes de comisiones/tiempos):");
    for (const o of opportunities) lines.push(formatOpportunityLine(o));
  }

  if (errors.length > 0) {
    lines.push(`\nSin datos (${errors.length}): ${errors.map((e) => `${e.asset}/${e.fiat}`).join(", ")}`);
  }

  return lines.join("\n");
}

export function formatTelegramReport(
  results: CurrencySpread[],
  opportunities: ArbitrageOpportunity[],
  topN: number,
  alertThresholdPct: number,
  trends: Map<string, number | null>,
): string {
  const sortedDesc = [...results].sort((a, b) => metric(b) - metric(a));
  const topSell = sortedDesc.slice(0, topN); // mercados donde el activo cotiza mas caro -> mejor para vender
  const topBuy = sortedDesc.slice(-topN).reverse(); // mercados donde cotiza mas barato -> mejor para comprar

  const lines: string[] = [];

  if (opportunities.length > 0) {
    lines.push("<b>Mejor oportunidad teorica por activo</b>");
    for (const o of opportunities) lines.push(formatOpportunityLine(o));
    lines.push("");
  }

  const renderRow = (r: CurrencySpread): string => {
    const m = metric(r);
    const trend = trends.get(historyKey(r.asset, r.fiat));
    const trendTxt = trend !== null && trend !== undefined ? ` (${trend >= 0 ? "+" : ""}${trend.toFixed(1)}pp/24h)` : "";
    const alertFlag = Math.abs(m) >= alertThresholdPct ? " \u{1F514}" : "";
    const metricTxt = r.premiumPct !== null ? `premium ${r.premiumPct.toFixed(2)}%` : `spread ${r.spreadPct.toFixed(2)}%`;
    return `${r.asset} ${r.fiat}: compra ${r.bestBuyPrice.toFixed(2)} / venta ${r.bestSellPrice.toFixed(2)} | ${metricTxt}${trendTxt}${alertFlag}`;
  };

  lines.push(`<b>Top ${topSell.length} para VENDER (mas caro)</b>`);
  lines.push(...topSell.map(renderRow));
  lines.push("");
  lines.push(`<b>Top ${topBuy.length} para COMPRAR (mas barato)</b>`);
  lines.push(...topBuy.map(renderRow));

  lines.push(
    "\n⚠ Esto es una senal, no una garantia: verifica comisiones, limites, tiempos de transferencia, " +
      "reputacion del anunciante y restricciones legales/de control de cambios antes de operar.",
  );

  return lines.join("\n");
}
