import { existsSync } from "node:fs";
import { chromium, type BrowserContext } from "playwright";
import { config } from "./config.js";

/**
 * Abre un navegador reusando la sesion guardada con "npm run login".
 * Nunca guardamos usuario/contrasena en el codigo: el login (incluyendo
 * el 2FA o captcha de Binance) lo haces vos a mano una sola vez.
 */
export async function openAuthenticatedBrowser(headless: boolean): Promise<BrowserContext> {
  if (!existsSync(config.authStatePath)) {
    throw new Error(
      `No encontre una sesion guardada en ${config.authStatePath}. Corre primero "npm run login".`,
    );
  }

  const browser = await chromium.launch({ headless });
  const context = await browser.newContext({ storageState: config.authStatePath });
  return context;
}
