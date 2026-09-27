# Hierbas & Infusiones 🌿☯️

App móvil (Expo + React Native + TypeScript) para explorar hierbas y plantas usadas en infusión,
combinando dos tradiciones:

- **Herboristería occidental / criolla**: ~20 hierbas (manzanilla, jengibre, valeriana, boldo, etc.)
- **Medicina Tradicional China (MTC)**: ~14 hierbas clásicas (ginseng, astrágalo, reishi, goji, etc.),
  conceptos básicos (Qi, Yin-Yang, 5 elementos, 5 sabores, naturaleza térmica) y los patrones/
  desequilibrios más comunes (Qi bajo, Yin bajo, Qi del hígado estancado, humedad-flema, Yang del
  riñón bajo, Wei Qi/defensas, Shen).

Este contenido es de carácter tradicional y educativo, no reemplaza el consejo médico. Cada pantalla
incluye un recordatorio de esto.

## Funcionalidad

- **Hierbas**: buscador y filtro por tradición (occidental / MTC) y por categoría (relajante,
  digestiva, diurética, tonificante, etc.) de ~34 plantas en total, con propiedades, usos
  tradicionales, forma de preparación y contraindicaciones. Las hierbas de la MTC además muestran su
  naturaleza térmica, sabor, meridianos y función según esa tradición.
- **Necesidades**: 10 necesidades de la tradición occidental + 7 patrones de la MTC, cada uno con 2
  combinaciones de hierbas sugeridas (ingredientes, preparación, frecuencia y advertencias puntuales).
  Se puede tocar cualquier hierba de una combinación para ver su detalle.
- **M. China**: conceptos básicos de la MTC, sus hierbas y sus patrones, todo junto.
- **Info**: qué es la app y cómo usarla.

## Estructura

- `src/app/` — rutas de Expo Router (`(tabs)` = tabs de Hierbas/Necesidades/M. China/Info, `herb/[id]`
  y `need/[id]` = pantallas de detalle).
- `src/data/` — contenido curado (`herbs.ts`, `needs.ts`, `tcmConcepts.ts`).
- `src/components/` — componentes de UI reutilizables.
- `src/theme/` — colores y etiquetas de categorías/tradiciones.

## Correr el proyecto

```sh
npm install
npx expo start --web    # o --android / --ios (requiere Expo Go o un build de desarrollo)
```

## Próximos pasos posibles

- Sumar más hierbas, necesidades y patrones de la MTC.
- Guardar favoritos o un historial de infusiones probadas.
- Buscar por síntoma libre (texto) además de por categoría.
- Sumar fórmulas clásicas completas de la MTC (con nombre en pinyin) para quien ya las conoce.
