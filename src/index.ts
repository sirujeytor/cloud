import { openAuthenticatedBrowser } from "./browserSession.js";
import { runWatchLoop } from "./p2p/watcher.js";

const headless = process.env.HEADLESS !== "false";

async function main() {
  console.log("Iniciando bot de asistencia P2P...");
  const context = await openAuthenticatedBrowser(headless);
  console.log("Sesion cargada. Vigilando ordenes abiertas...");
  await runWatchLoop(context);
}

main().catch((err) => {
  console.error("El bot se detuvo por un error:", err);
  process.exit(1);
});
