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
  scanAsset: process.env.SCAN_ASSET ?? "USDT",
  scanIntervalMs: Number(process.env.SCAN_INTERVAL_MS ?? 3_600_000),
  scanTopN: Number(process.env.SCAN_TOP_N ?? 8),
  scanReportPath: "data/scanner-reports/latest.json",
};

export function telegramConfigured(): boolean {
  return Boolean(config.telegramBotToken && config.telegramChatId);
}
