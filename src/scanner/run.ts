import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { config } from "../config.js";
import { notifyHuman } from "../notify/telegram.js";
import { scanAll } from "./analyzer.js";
import { fiatCurrencies } from "./currencies.js";
import { appendHistory, getPremiumDeltas, pruneHistory } from "./history.js";
import { findAllOpportunities } from "./opportunity.js";
import { formatConsoleReport, formatTelegramReport } from "./report.js";

async function runOnce(): Promise<void> {
  const assets = config.scanAssets;
  console.log(`Escaneando ${fiatCurrencies.length} monedas x ${assets.length} activos (${assets.join(", ")}) en Binance P2P...`);

  const { results, errors } = await scanAll(assets, fiatCurrencies);
  const opportunities = findAllOpportunities(assets, results);

  console.log(formatConsoleReport(results, errors, opportunities));

  await mkdir(dirname(config.scanReportPath), { recursive: true });
  await writeFile(
    config.scanReportPath,
    JSON.stringify({ timestamp: new Date().toISOString(), assets, results, errors, opportunities }, null, 2),
    "utf8",
  );

  await appendHistory(results);
  await pruneHistory(config.scanHistoryRetentionDays);

  if (results.length > 0) {
    const trends = await getPremiumDeltas(results);
    await notifyHuman(
      formatTelegramReport(results, opportunities, config.scanTopN, config.scanAlertThresholdPct, trends),
    );
  }
}

async function main() {
  const loop = process.argv.includes("--watch");

  await runOnce();
  if (!loop) return;

  console.log(`Repitiendo cada ${config.scanIntervalMs / 60000} minutos...`);
  setInterval(() => {
    runOnce().catch((err) => console.error("Error en el escaneo:", err));
  }, config.scanIntervalMs);
}

main().catch((err) => {
  console.error("El scanner se detuvo por un error:", err);
  process.exit(1);
});
