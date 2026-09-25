import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { config } from "../config.js";
import { notifyHuman } from "../notify/telegram.js";
import { scanAllCurrencies } from "./analyzer.js";
import { fiatCurrencies } from "./currencies.js";
import { formatConsoleReport, formatTelegramReport } from "./report.js";

async function runOnce(): Promise<void> {
  console.log(`Escaneando ${fiatCurrencies.length} monedas contra Binance P2P...`);
  const { results, errors } = await scanAllCurrencies(config.scanAsset, fiatCurrencies);

  console.log(formatConsoleReport(config.scanAsset, results, errors));

  await mkdir(dirname(config.scanReportPath), { recursive: true });
  await writeFile(
    config.scanReportPath,
    JSON.stringify({ timestamp: new Date().toISOString(), asset: config.scanAsset, results, errors }, null, 2),
    "utf8",
  );

  if (results.length > 0) {
    await notifyHuman(formatTelegramReport(config.scanAsset, results, config.scanTopN));
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
