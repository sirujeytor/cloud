# Incognito AdBlock

Extension de Chrome/Edge (Manifest V3), gratuita y sin cuentas ni version
premium, que bloquea anuncios y rastreadores conocidos usando la API
`declarativeNetRequest`. Pensada para funcionar tambien en **modo
incognito**.

## Aviso importante sobre el modo incognito

Por diseño de seguridad de Chrome/Edge, **ninguna extension puede activarse
sola en incognito**, ni siquiera las de pago: el usuario tiene que
permitirlo a mano, una sola vez. Esta extension deja el paso lo mas facil
posible (el popup te avisa y te lleva directo a la pantalla correcta si
todavia no lo activaste).

## Instalacion (como extension "sin empaquetar")

1. Abrir `chrome://extensions` (o `edge://extensions` en Edge).
2. Activar el interruptor **"Modo de desarrollador"** (arriba a la derecha).
3. Click en **"Cargar extension descomprimida"** (Load unpacked) y elegir
   esta carpeta (`incognito-adblock/`).
4. En la tarjeta de la extension, click en **"Detalles"** y activar
   **"Permitir en modo incognito"**.
5. Listo: el icono aparece en la barra de herramientas, tambien en
   ventanas de incognito.

No hace falta publicarla en la Chrome Web Store para usarla en tu propia
PC. Si en algun momento quisieras compartirla ahi, Google cobra un pago
**unico** de registro de desarrollador (no es una suscripcion), pero no es
necesario para uso personal.

## Como funciona

- `rules.json` contiene ~150 reglas de bloqueo generadas a partir de las
  listas en `lists/` (redes de anuncios conocidas y rastreadores de
  analitica/perfilado).
- El navegador aplica esas reglas de forma nativa (no hay que analizar
  cada request en JavaScript), asi que es rapido y liviano.
- El popup permite:
  - Activar/desactivar la proteccion con un switch.
  - Ver cuantos anuncios/rastreadores se bloquearon.
  - Reiniciar el contador.
  - Ir directo a la pantalla para habilitar el modo incognito.

## Actualizar la lista de dominios bloqueados

1. Editar `lists/ads.txt` y/o `lists/trackers.txt` (un dominio por linea).
2. Regenerar `rules.json`:

   ```bash
   python3 scripts/gen_rules.py
   ```

3. Recargar la extension desde `chrome://extensions` (icono de refrescar).

## Regenerar los iconos

```bash
pip install pillow
python3 scripts/gen_icons.py
```

## Limitaciones (para que no te sorprenda)

- Bloquea por **dominio conocido**, no analiza el contenido de la pagina
  como hacen uBlock Origin o AdBlock Plus con reglas CSS/cosmeticas. No
  oculta espacios vacios donde iba un anuncio, solo evita que se cargue.
- Las listas son curadas a mano y bastante mas chicas que EasyList/
  EasyPrivacy (que tienen decenas de miles de reglas). Cubre las redes
  de publicidad y rastreo mas comunes, pero algun anuncio puntual puede
  pasar.
- Si un sitio deja de funcionar bien, probablemente sea porque algun
  dominio bloqueado es necesario para su funcionamiento (ej. un CDN
  compartido). Se soluciona sacando esa linea de `lists/` y regenerando
  `rules.json`.
