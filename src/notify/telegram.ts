import { config, telegramConfigured } from "../config.js";

/**
 * Manda un aviso a Telegram. Se usa para todo lo que necesita ojo humano:
 * un cliente marco el pago y hay que confirmarlo y liberar la operacion.
 * Si no configuraste TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID, solo lo imprime
 * por consola para que el bot igual sea usable mientras lo configuras.
 */
export async function notifyHuman(message: string): Promise<void> {
  if (!telegramConfigured()) {
    console.log(`[AVISO - configura Telegram para recibir esto en tu celular]\n${message}`);
    return;
  }

  const url = `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: config.telegramChatId,
      text: message,
      parse_mode: "HTML",
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`No se pudo notificar por Telegram (${response.status}): ${body}`);
  }
}
