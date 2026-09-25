import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { chromium } from "playwright";
import { config } from "./config.js";

/**
 * Corre esto UNA vez (npm run login): abre un Chrome de verdad, vos entras
 * a Binance y haces login normal (con 2FA, captcha, lo que pida). Cuando
 * llegues a la lista de ordenes P2P, apreta ENTER en esta terminal y
 * guardamos la sesion para que el bot la reuse sin volver a pedirte nada.
 */
async function main() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://accounts.binance.com/en/login");

  console.log("\nHace login normal en la ventana que se abrio.");
  console.log("Cuando ya estes logueado (2FA incluido), volve aca y apreta ENTER.\n");
  await waitForEnter();

  await mkdir(dirname(config.authStatePath), { recursive: true });
  await context.storageState({ path: config.authStatePath });
  console.log(`Sesion guardada en ${config.authStatePath}. Ya podes correr "npm run dev".`);

  await browser.close();
}

function waitForEnter(): Promise<void> {
  return new Promise((resolve) => {
    process.stdin.once("data", () => resolve());
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
