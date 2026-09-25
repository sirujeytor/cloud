import "dotenv/config";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === "") {
    throw new Error(`Falta la variable de entorno ${name} (revisa tu .env)`);
  }
  return value;
}

export const config = {
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN ?? "",
  telegramChatId: process.env.TELEGRAM_CHAT_ID ?? "",
  pollIntervalMs: Number(process.env.POLL_INTERVAL_MS ?? 15000),
  ordersUrl: required("BINANCE_P2P_ORDERS_URL", "https://p2p.binance.com/en/orderList"),
  authStatePath: required("AUTH_STATE_PATH", "auth/state.json"),
  stateFilePath: "data/state.json",
  templatesPath: "config/templates.json",

  // Scanner de arbitraje P2P (solo Binance, publico, no requiere login)
  scanAssets: (process.env.SCAN_ASSETS ?? "USDT,USDC,BTC,ETH").split(",").map((a) => a.trim()).filter(Boolean),
  scanIntervalMs: Number(process.env.SCAN_INTERVAL_MS ?? 3_600_000),
  scanTopN: Number(process.env.SCAN_TOP_N ?? 8),
  scanReportPath: "data/scanner-reports/latest.json",
  // Monto de operacion de referencia (en USD) para filtrar anuncios que puedan cubrirlo
  scanTradeAmountUsd: Number(process.env.SCAN_TRADE_AMOUNT_USD ?? 100),
  // Tasa minima de finalizacion mensual del comerciante (0-1) para confiar en su precio
  scanMinCompletionRate: Number(process.env.SCAN_MIN_COMPLETION_RATE ?? 0.85),
  // A partir de que |premium/spread| (en %) se marca una fila como alerta en el aviso
  scanAlertThresholdPct: Number(process.env.SCAN_ALERT_THRESHOLD_PCT ?? 5),
  // Cuantos dias de historial conservar para calcular tendencias
  scanHistoryRetentionDays: Number(process.env.SCAN_HISTORY_RETENTION_DAYS ?? 14),
  // Pausa entre pedidos HTTP sucesivos, para no golpear los endpoints publicos de una
  scanRequestDelayMs: Number(process.env.SCAN_REQUEST_DELAY_MS ?? 250),
};

export function telegramConfigured(): boolean {
  return Boolean(config.telegramBotToken && config.telegramChatId);
}
