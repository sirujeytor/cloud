# Hierbas & Infusiones 🌿

App móvil (Expo + React Native + TypeScript) para explorar hierbas y plantas usadas en infusión,
y descubrir combinaciones recomendadas según necesidad (ansiedad, insomnio, digestión, defensas,
retención de líquidos, purificación, dolores menstruales, energía, etc.).

Este contenido es de carácter tradicional y educativo, no reemplaza el consejo médico. Cada pantalla
incluye un recordatorio de esto.

## Funcionalidad

- **Hierbas**: buscador y filtro por categoría (relajante, digestiva, diurética, etc.) de ~20 plantas,
  con propiedades, usos tradicionales, forma de preparación y contraindicaciones.
- **Necesidades**: 10 necesidades comunes, cada una con 2 combinaciones de hierbas sugeridas
  (ingredientes, preparación, frecuencia y advertencias puntuales). Se puede tocar cualquier hierba
  de una combinación para ver su detalle.
- **Info**: qué es la app y cómo usarla.

## Estructura

- `src/app/` — rutas de Expo Router (`(tabs)` = tabs de Hierbas/Necesidades/Info, `herb/[id]` y
  `need/[id]` = pantallas de detalle).
- `src/data/` — contenido curado (`herbs.ts`, `needs.ts`).
- `src/components/` — componentes de UI reutilizables.
- `src/theme/` — colores y etiquetas de categorías.

## Correr el proyecto

```sh
npm install
npx expo start --web    # o --android / --ios (requiere Expo Go o un build de desarrollo)
```

## Próximos pasos posibles

- Sumar más hierbas y necesidades.
- Guardar favoritos o un historial de infusiones probadas.
- Buscar por síntoma libre (texto) además de por categoría.
