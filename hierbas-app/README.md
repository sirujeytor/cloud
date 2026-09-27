# Hierbas & Infusiones 🌿☯️

App móvil (Expo + React Native + TypeScript) para explorar hierbas y plantas usadas en infusión,
combinando cinco tradiciones de herboristería:

- **Herboristería occidental / criolla y Grecorromana-Árabe**: ~30 hierbas (manzanilla, jengibre,
  valeriana, boldo, hipérico, tomillo, etc.)
- **Medicina Tradicional China (MTC)**: ~21 hierbas clásicas (ginseng, astrágalo, reishi, goji,
  danshen, ginkgo, etc.), conceptos básicos (Qi, Yin-Yang, 5 elementos, 5 sabores, naturaleza
  térmica) y los patrones/desequilibrios más comunes (Qi bajo, Yin bajo, Qi del hígado estancado,
  humedad-flema, Yang del riñón bajo, Wei Qi/defensas, Shen).
- **Ayurveda (India)**: 20 hierbas (cúrcuma, ashwagandha, tulsi, brahmi, shatavari, etc.).
- **Culturas precolombinas de América**: 20 hierbas (boldo, muña/peperina, maca, uña de gato,
  cacao, quina, etc.).
- **Medicina tradicional africana**: 20 hierbas (rooibos, garra del diablo, pygeum, aloe vera,
  kanna, etc.), incluidas algunas con implicancias de seguridad importantes (kratom, hipérico)
  investigadas y documentadas con advertencias específicas.

En total, 109 hierbas. Este contenido es de carácter tradicional y educativo, no reemplaza el
consejo médico. Cada pantalla incluye un recordatorio de esto, y las hierbas con riesgos conocidos
(interacciones medicamentosas, toxicidad, embarazo) tienen contraindicaciones explícitas y
reforzadas.

## Funcionalidad

- **Hierbas**: buscador y filtro por tradición (5 tradiciones) y por categoría (relajante,
  digestiva, diurética, tonificante, cardiovascular, piel, cognitiva, salud masculina/femenina,
  etc.) de las 109 plantas, con propiedades, usos tradicionales, forma de preparación y
  contraindicaciones. Las hierbas de más de una tradición (como el jengibre o el hinojo) muestran
  todas sus etiquetas. Las hierbas de la MTC además muestran su naturaleza térmica, sabor,
  meridianos y función según esa tradición.
- **Necesidades**: 10 necesidades de la tradición occidental + 7 patrones de la MTC, con buscador por
  síntoma o por hierba, cada una con 2 combinaciones de hierbas sugeridas (ingredientes, preparación,
  frecuencia y advertencias puntuales). Se puede tocar cualquier hierba de una combinación para ver su
  detalle.
- **Mi rutina**: favoritos. Tocando la ☆ en cualquier hierba o combinación se guarda acá (persistido
  en el dispositivo con AsyncStorage). Desde una combinación guardada se puede activar un
  **recordatorio diario** (notificación local) para no olvidarse de tomarla — disponible en la app
  instalada en el celular, no en la versión web.
- **M. China**: conceptos básicos de la MTC, sus hierbas y sus patrones, todo junto.
- **Info**: qué es la app y cómo usarla.

## Estructura

- `src/app/` — rutas de Expo Router (`(tabs)` = tabs de Hierbas/Necesidades/Mi rutina/M. China/Info,
  `herb/[id]` y `need/[id]` = pantallas de detalle).
- `src/data/` — contenido curado (`herbs.ts`, `needs.ts`, `tcmConcepts.ts`).
- `src/components/` — componentes de UI reutilizables.
- `src/context/` — `AppDataContext` (favoritos y recordatorios, persistidos con AsyncStorage).
- `src/lib/` — `reminders.ts` (wrapper de `expo-notifications` para programar/cancelar recordatorios).
- `src/theme/` — colores y etiquetas de categorías/tradiciones.

## Correr el proyecto

```sh
npm install
npx expo start --web    # o --android / --ios (requiere Expo Go o un build de desarrollo)
```

## Próximos pasos posibles

- Sumar más hierbas, necesidades y patrones de la MTC.
- Sumar fórmulas clásicas completas de la MTC (con nombre en pinyin) para quien ya las conoce.
- Elegir un horario personalizado para el recordatorio (hoy son horarios prefijados: mañana, mediodía,
  tarde, noche).
- Historial de infusiones tomadas, no solo favoritos.
