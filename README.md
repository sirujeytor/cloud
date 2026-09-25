# Bot de asistencia P2P (Binance)

Bot que ayuda a atender operaciones P2P de Binance cuando no llegas a los
tiempos: responde a los clientes en el chat con plantillas configurables y
te avisa por Telegram apenas alguien marca una operacion como pagada, para
que la verifiques y la liberes vos mismo.

**Que NO hace, a proposito:** no libera cripto ni confirma pagos de forma
automatica. Solo avisa. La decision final la toma una persona, porque
liberar una operacion sin que el pago realmente haya llegado es una
perdida irreversible.

## Advertencia importante

Automatizar la interfaz web de Binance con un bot puede ir en contra de
los Terminos de Servicio de Binance (no hay una API oficial para P2P) y
existe riesgo real de que la cuenta sea suspendida o revisada. Es una
decision de negocio de ustedes, pero conviene:

- Empezar en una cuenta de prueba o con montos chicos para validar que
  todo funciona antes de escalar.
- Revisar los Terminos de Servicio de Binance con tu amigo antes de dejarlo
  corriendo sin supervision.
- No dejarlo 100% desatendido: esta pensado como un asistente, no un
  reemplazo total de la persona.

## Como funciona

1. Un script de login abre un Chrome real para que hagas el login a mano
   (usuario, contrasena, 2FA, captcha si aparece). Eso evita meter
   credenciales sensibles en el codigo.
2. El bot reutiliza esa sesion para mirar la lista de ordenes P2P abiertas
   cada cierto tiempo.
3. Por cada orden, lee los mensajes nuevos del cliente y responde segun las
   reglas de `config/templates.json` (editable sin tocar codigo).
4. Si detecta que el estado de la orden paso a "pagado", te manda un aviso
   por Telegram con el link de la orden para que la revises vos.

## Instalacion

```bash
npm install
npx playwright install chromium
cp .env.example .env   # completa TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID
```

Para el aviso por Telegram: cread un bot con
[@BotFather](https://t.me/BotFather), copia el token, y conseguir tu
`chat_id` mandandole un mensaje al bot y consultando
`https://api.telegram.org/bot<TOKEN>/getUpdates`.

## Primer uso

```bash
npm run login   # una sola vez, para guardar la sesion logueada
npm run dev     # corre el bot (deja la ventana visible por defecto)
```

Para correrlo sin ventana visible una vez que ya probaste que anda:

```bash
HEADLESS=true npm run dev
```

## Calibrar los selectores

Binance cambia el HTML seguido y no publica una API para P2P, asi que los
selectores en `src/p2p/selectors.ts` son un punto de partida y **hay que
verificarlos contra la pagina real** antes de confiar en el bot:

1. Corre `npm run dev` con `HEADLESS=false` (por defecto).
2. Si algo no matchea (el bot no ve mensajes, no detecta el estado
   "pagado", etc.), inspecciona el elemento en el navegador y actualiza el
   selector correspondiente en `src/p2p/selectors.ts`.

## Editar las respuestas automaticas

Todo esta en `config/templates.json`. Cada regla tiene `keywords` (palabras
que disparan la respuesta) y `reply` (el texto que se manda). No hace falta
reiniciar el bot para probar cambios chicos, pero si conviene reiniciarlo
para asegurarse de que tomo el archivo nuevo.
