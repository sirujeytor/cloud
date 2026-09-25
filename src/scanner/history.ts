import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { CurrencySpread } from "./analyzer.js";

const HISTORY_PATH = "data/scanner-reports/history.jsonl";

interface HistoryEntry {
  timestamp: string;
  asset: string;
  fiat: string;
  premiumPct: number | null;
  spreadPct: number;
}

function historyKey(asset: string, fiat: string): string {
  return `${asset}:${fiat}`;
}

export async function appendHistory(results: CurrencySpread[]): Promise<void> {
  await mkdir(dirname(HISTORY_PATH), { recursive: true });
  const timestamp = new Date().toISOString();
  const lines =
    results
      .map((r) =>
        JSON.stringify({
          timestamp,
          asset: r.asset,
          fiat: r.fiat,
          premiumPct: r.premiumPct,
          spreadPct: r.spreadPct,
        } satisfies HistoryEntry),
      )
      .join("\n") + "\n";
  await appendFile(HISTORY_PATH, lines, "utf8");
}

async function readAllEntries(): Promise<HistoryEntry[]> {
  let raw: string;
  try {
    raw = await readFile(HISTORY_PATH, "utf8");
  } catch {
    return [];
  }
  const entries: HistoryEntry[] = [];
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    try {
      entries.push(JSON.parse(line) as HistoryEntry);
    } catch {
      // linea corrupta, se ignora
    }
  }
  return entries;
}

export async function pruneHistory(retentionDays: number): Promise<void> {
  const entries = await readAllEntries();
  if (entries.length === 0) return;
  const cutoff = Date.now() - retentionDays * 86_400_000;
  const kept = entries.filter((e) => new Date(e.timestamp).getTime() >= cutoff);
  const lines = kept.map((e) => JSON.stringify(e)).join("\n") + (kept.length ? "\n" : "");
  await writeFile(HISTORY_PATH, lines, "utf8");
}

/**
 * Devuelve el delta de premium (en puntos porcentuales) contra el dato mas
 * cercano a hace 24hs. Si no hay ningun dato dentro de una ventana de +-3hs
 * de esa marca, devuelve null en vez de inventar una tendencia con datos
 * poco representativos.
 */
export async function getPremiumDeltas(
  results: CurrencySpread[],
): Promise<Map<string, number | null>> {
  const entries = await readAllEntries();
  const targetTime = Date.now() - 24 * 3_600_000;
  const windowMs = 3 * 3_600_000;
  const deltas = new Map<string, number | null>();

  for (const r of results) {
    if (r.premiumPct === null) {
      deltas.set(historyKey(r.asset, r.fiat), null);
      continue;
    }
    let closest: HistoryEntry | null = null;
    let closestDiff = Infinity;
    for (const e of entries) {
      if (e.asset !== r.asset || e.fiat !== r.fiat || e.premiumPct === null) continue;
      const diff = Math.abs(new Date(e.timestamp).getTime() - targetTime);
      if (diff < closestDiff) {
        closestDiff = diff;
        closest = e;
      }
    }
    deltas.set(
      historyKey(r.asset, r.fiat),
      closest && closestDiff <= windowMs ? r.premiumPct - closest.premiumPct! : null,
    );
  }

  return deltas;
}

export { historyKey };
