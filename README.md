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

## Scanner de arbitraje P2P (`src/scanner`)

Un modulo aparte, mas simple y de menor riesgo que el bot de arriba: no
automatiza el navegador ni necesita login, solo hace pedidos HTTP de
lectura a endpoints publicos (Binance P2P, el spot publico de Binance para
BTC/ETH, y un par de fuentes de tipo de cambio real). Recorre muchas
monedas fiat y varios activos, y calcula por cada combinacion:

- **Spread interno**: diferencia entre el mejor precio de compra y de venta
  dentro de la misma moneda.
- **Premium real**: cuanto por encima o por debajo del valor real de
  mercado (tipo de cambio real, no el "oficial" cuando ese no sirve — ver
  abajo) cotiza el activo en esa moneda. Es la base para detectar
  arbitraje genuino entre paises, no solo spread interno.
- **Mejor oportunidad teorica**: para cada activo, en que pais convendria
  comprarlo (mas barato en USD reales) y en cual convendria venderlo (mas
  caro en USD reales), con el porcentaje teorico de ganancia.

```bash
npm run scan          # corre una vez y termina
npm run scan:watch    # corre y despues se repite cada SCAN_INTERVAL_MS (1 hora por defecto)
```

Cada corrida guarda el reporte completo en
`data/scanner-reports/latest.json`, agrega una linea por moneda/activo a
`data/scanner-reports/history.jsonl` (para poder mostrar tendencia de 24hs)
y, si configuraste Telegram, manda un resumen con los `SCAN_TOP_N` mejores
mercados para vender y para comprar, marcando con 🔔 los que superan
`SCAN_ALERT_THRESHOLD_PCT`.

### Como calcula el "valor real"

- Para la mayoria de las monedas usa una tabla de tipos de cambio oficial
  (open.er-api.com, gratis, sin API key).
- Para monedas con control de cambios donde la tasa oficial no sirve de
  referencia (empieza con Argentina, via la cotizacion "blue" de
  bluelytics.com.ar) hay un mapa de overrides en `src/scanner/fxRates.ts`
  donde se pueden enchufar mas fuentes especificas por pais (Venezuela,
  etc.) a medida que las necesiten.
- Para BTC/ETH, el "valor real" de referencia es su precio spot publico en
  Binance (`api.binance.com`, distinto del endpoint de P2P). Para
  USDT/USDC se asume que valen 1 USD.

### Filtros de calidad de precio

Antes de tomar el "mejor precio" de cada lado, se descartan anuncios de
comerciantes con `monthFinishRate` menor a `SCAN_MIN_COMPLETION_RATE`, y se
prioriza a los que puedan cubrir una operacion de `SCAN_TRADE_AMOUNT_USD`
(convertido a la moneda local con el tipo de cambio real). Si el filtro
deja la lista vacia para esa moneda, se usa igual el mejor precio
disponible sin filtrar, en vez de no reportar nada.

**Limitaciones y cosas a verificar antes de confiar en los numeros:**
- Ninguno de estos endpoints (Binance P2P, Binance spot, las fuentes de FX)
  es una API oficial garantizada para este uso: pueden cambiar de forma o
  empezar a bloquear pedidos automatizados sin aviso. El codigo reintenta
  con backoff ante fallos, pero no hay garantia de disponibilidad.
- La lista de monedas en `src/scanner/currencies.ts` es una seleccion
  curada a mano (~70 monedas), no una lista dinamica obtenida de Binance:
  intente evitar adivinar el formato de un endpoint no documentado para no
  meter una funcion que parezca confiable sin estar realmente verificada.
  Se edita libremente agregando o sacando codigos.
- El "arbitraje teorico" que calcula **no descuenta comisiones de Binance,
  el spread de conversion, tiempos de transferencia, ni restricciones
  legales o de control de cambios** que puedan impedir mover el dinero
  entre paises en la practica. Es una senal para investigar, no una
  ganancia garantizada.
- No se pudo probar contra las APIs reales en el entorno donde se
  desarrollo esto por una restriccion de red del sandbox — se probo toda
  la logica de calculo y formateo con datos simulados, pero conviene
  correr `npm run scan` una vez y revisar la salida por consola antes de
  dejarlo en modo `--watch` sin supervision.
