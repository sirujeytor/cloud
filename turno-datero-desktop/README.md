# Turno Datero (escritorio)

App de escritorio personal para organizar tu turno como datero de Máquinas de
Ventas: seguimiento de publicaciones diarias, pipeline de leads con alertas
de respuesta y puntaje de lead caliente, plantillas de respuesta, calculadora
de cuota, y dos funciones con IA (analizar un chat pegado y generar textos de
publicación) que usan tu propia API key de DeepSeek.

Es la misma app que la versión web (Artifact de Claude), pero standalone:
no depende de estar dentro de Claude para nada, así que las funciones de IA
usan DeepSeek en vez del asistente de Claude.

## Requisitos

- [Node.js](https://nodejs.org) 18 o más nuevo instalado.

## Cómo correrla en modo desarrollo

```bash
cd turno-datero-desktop
npm install
npm start
```

Se abre una ventana de escritorio con la app. Los datos (leads, publicaciones,
plantillas) se guardan localmente en esta computadora; no se sincronizan con
la versión web ni entre dispositivos.

## Cómo generar un instalador

```bash
npm run dist
```

El instalador queda en la carpeta `dist/`. Importante: `electron-builder`
genera el instalador para la plataforma en la que lo corrés — para tener un
`.exe` de Windows corré este comando en Windows, para un `.dmg` de Mac
corrélo en Mac, etc. No se puede generar el instalador de Windows desde
Linux sin herramientas extra (Wine).

Si no querés generar un instalador todavía, `npm start` ya te deja usar la
app como una ventana de escritorio normal.

## Configurar tu API key de DeepSeek

1. Entrá a [platform.deepseek.com](https://platform.deepseek.com) y creá una
   API key en la sección "API Keys".
2. Abrí la app, andá a la pestaña **Herramientas → Ajustes de IA**.
3. Pegá la key y tocá **Guardar**. Se guarda solo en esta computadora, nunca
   se manda a Claude ni a ningún otro lado.
4. Tocá **Probar conexión** para confirmar que funciona.

El uso de "Analizar con IA" (para pegar chats de WhatsApp y auto-completar un
lead) y "Generador de publicaciones" se cobra a tu cuenta de DeepSeek, no a
Claude.

## Qué no se pudo probar acá

Este proyecto se armó en un entorno sin pantalla (no se puede abrir una
ventana de Electron ni probar una llamada real a la API de DeepSeek desde
acá). `npm install` y la estructura del proyecto están verificados, pero la
primera vez que la corras en tu computadora conviene:

- Confirmar que la ventana abre bien con `npm start`.
- Probar "Probar conexión" en Ajustes de IA con una key real para confirmar
  que el llamado a DeepSeek funciona como se espera.

Si algo no anda, avisale a Claude con el mensaje de error exacto que
aparece en pantalla.
