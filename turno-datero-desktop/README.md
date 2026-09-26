# Turno Datero (escritorio)

App de escritorio personal para organizar tu turno como datero de Máquinas de
Ventas: seguimiento de publicaciones diarias, pipeline de leads con alertas
de respuesta y puntaje de lead caliente, plantillas de respuesta, calculadora
de cuota, y dos funciones con IA (analizar un chat pegado y generar textos de
publicación) que usan tu propia API key de DeepSeek.

Además:

- **Notificaciones de Windows**: cuando un lead activo pasa 15 o 60 minutos
  sin que marques que le respondiste, te llega una notificación del sistema
  aunque la ventana esté minimizada al icono de la bandeja.
- **Icono en la bandeja del sistema**: cerrar la ventana (la X) no cierra la
  app, la manda a la bandeja para que siga vigilando tus leads. "Salir" desde
  el menú del icono de la bandeja sí la cierra del todo.
- **Botón de WhatsApp** en cada lead y en la ficha de carga: abre la
  conversación directo en tu WhatsApp (Web o Desktop, el que tengas
  configurado como predeterminado), sin tener que copiar el número a mano.
  El formateo del número para Argentina es una aproximación (agrega 54 9 +
  el número); si un link no abre la conversación correcta, revisá que el
  teléfono cargado esté completo.
- **Exportar / Importar datos**: en Semana → Datos, un botón para descargar
  un respaldo en JSON y otro para restaurarlo. Conviene exportar de vez en
  cuando por si necesitás reinstalar o cambiar de computadora.

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
ventana de Electron, mostrar una notificación real de Windows, ni probar una
llamada real a la API de DeepSeek desde acá). Lo que sí se verificó:
sintaxis de todos los archivos, que no falten IDs entre el HTML y el JS, que
`npm install` instale bien Electron y electron-builder, y que el ícono
generado sea un PNG/ICO válido. La primera vez que la corras en tu
computadora conviene:

- Confirmar que la ventana abre bien con `npm start` y que aparece el ícono
  en la bandeja del sistema.
- Aceptar el permiso de notificaciones si Windows lo pide, y probar que una
  alerta de "Respondé pronto" realmente te llega como notificación.
- Probar el botón de WhatsApp con un teléfono real para confirmar que abre
  la conversación correcta.
- Probar "Probar conexión" en Ajustes de IA con una key real de DeepSeek.

Si algo no anda, avisale a Claude con el mensaje de error exacto que
aparece en pantalla.
