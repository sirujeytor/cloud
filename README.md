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

## Scanner de spreads P2P (`src/scanner`)

Un modulo aparte, mas simple y de menor riesgo que el bot de arriba: no
automatiza el navegador ni necesita login, solo hace pedidos HTTP de
lectura al endpoint publico que usa la pagina web de Binance P2P para
listar anuncios. Recorre muchas monedas fiat y calcula, para cada una, la
diferencia entre el mejor precio de compra y el mejor precio de venta.

```bash
npm run scan          # corre una vez y termina
npm run scan:watch    # corre y despues se repite cada SCAN_INTERVAL_MS (1 hora por defecto)
```

Cada corrida guarda el reporte completo en
`data/scanner-reports/latest.json` y, si configuraste Telegram, manda un
resumen con las `SCAN_TOP_N` monedas de mayor spread.

**Que mide en realidad:** el spread que calcula es compra-vs-venta *dentro
de la misma moneda* (por ejemplo, cuanto mas caro esta comprar USDT con
pesos argentinos contra venderlo por pesos argentinos). Eso muestra que
mercados estan mas ilíquidos o volatiles, pero **no es todavia arbitraje
confirmado entre paises** (comprar barato en un fiat y vender caro en
otro): para eso falta comparar contra un tipo de cambio real entre las dos
monedas, que se puede sumar despues como fase 2 si les sirve.

**Limitaciones a tener en cuenta:**
- El endpoint no es una API oficial ni documentada por Binance: puede
  cambiar de forma sin aviso o empezar a bloquear pedidos automatizados.
- La lista de monedas en `src/scanner/currencies.ts` es una seleccion
  curada, no la lista completa y oficial (Binance no publica una) — se
  edita libremente agregando o sacando codigos.
- Toma el precio del primer anuncio de cada lado sin filtrar por límites
  de monto ni reputacion del vendedor/comprador; para un uso serio
  conviene agregar esos filtros.
