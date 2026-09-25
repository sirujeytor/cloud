import type { CurrencySpread, ScanError } from "./analyzer.js";

export function formatConsoleReport(
  asset: string,
  results: CurrencySpread[],
  errors: ScanError[],
): string {
  const lines: string[] = [];
  lines.push(`Escaneo P2P Binance (${asset}) - ${new Date().toLocaleString()}`);
  lines.push("fiat\tcompra\tventa\tspread%");
  for (const r of results) {
    lines.push(
      `${r.fiat}\t${r.bestBuyPrice.toFixed(2)}\t${r.bestSellPrice.toFixed(2)}\t${r.spreadPct.toFixed(2)}%`,
    );
  }
  if (errors.length > 0) {
    lines.push(`\nSin datos (${errors.length}): ${errors.map((e) => e.fiat).join(", ")}`);
  }
  return lines.join("\n");
}

export function formatTelegramReport(
  asset: string,
  results: CurrencySpread[],
  topN: number,
): string {
  const top = results.slice(0, topN);
  const lines = [`<b>Top ${topN} spreads P2P (${asset})</b>`];
  for (const r of top) {
    lines.push(
      `${r.fiat}: comprar a ${r.bestBuyPrice.toFixed(2)} / vender a ${r.bestSellPrice.toFixed(2)} (spread ${r.spreadPct.toFixed(2)}%)`,
    );
  }
  lines.push("\nRecorda: esto es spread dentro del mismo mercado, no arbitraje confirmado entre paises.");
  return lines.join("\n");
}
