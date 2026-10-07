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

Además de hierbas, el catálogo incluye **frutas y verduras** que también se usan en infusión
(cáscaras de cítricos, rosa mosqueta, hibisco, arándanos, hojas de vid roja y de olivo, alcachofa,
apio, remolacha, etc.), para armar combinaciones más grandes y variadas.

En total, 136 ingredientes (111 hierbas y especias + 25 frutas/verduras). Este contenido es de
carácter tradicional y educativo, no reemplaza el consejo médico. Cada pantalla incluye un
recordatorio de esto, y los ingredientes con riesgos conocidos (interacciones medicamentosas,
toxicidad, embarazo) tienen contraindicaciones explícitas y reforzadas — por ejemplo, el pomelo y
sus interacciones medicamentosas, o las hojas de durazno y su contenido de compuestos cianogénicos.

Además del catálogo de ingredientes, la app tiene un **recetario de 24 infusiones predefinidas**
(pestaña "Infusiones"), pensado para explorar por sabor o estilo en vez de por síntoma — mezclas
clásicas investigadas (naranja especiada, chai sin cafeína, leche dorada, limón-jengibre-miel,
goji con crisantemo, etc.) que combinan hierbas con frutas y verduras.

## Funcionalidad

- **Hierbas, frutas y verduras**: buscador y filtro por tipo (hierba/fruta/verdura), por tradición
  (5 tradiciones) y por categoría (relajante, digestiva, diurética, tonificante, cardiovascular,
  piel, cognitiva, salud masculina/femenina, etc.) de los 136 ingredientes, con propiedades, usos
  tradicionales, forma de preparación y contraindicaciones. Los ingredientes de más de una
  tradición (como el jengibre o el hinojo) muestran todas sus etiquetas. Las hierbas de la MTC
  además muestran su naturaleza térmica, sabor, meridianos y función según esa tradición.
- **Síntomas** (pestaña "Necesidades" del código): 11 necesidades de la tradición occidental (una
  de ellas, "Antioxidante y vitamina C", pensada especialmente con frutas) + 7 patrones de la MTC,
  con buscador por síntoma o por ingrediente, cada una con 2 o 3 combinaciones sugeridas
  (ingredientes, preparación, frecuencia y advertencias puntuales) — varias ya combinan hierbas con
  frutas o verduras en una misma mezcla. Se puede tocar cualquier ingrediente para ver su detalle.
- **Infusiones**: recetario de 24 mezclas predefinidas para explorar por sabor/estilo (cítrica,
  especiada, frutal, floral, fría, dulce, energizante, relajante, digestiva, detox, clásica), con
  buscador por ingrediente. Cada receta tiene ingredientes con proporciones, preparación y, cuando
  corresponde, un tip para servir o una advertencia puntual.
- **Mi rutina**: favoritos. Tocando la ☆ en cualquier hierba, combinación o infusión se guarda acá
  (persistido en el dispositivo con AsyncStorage). Desde una combinación de "Necesidades" guardada
  se puede activar un **recordatorio diario** (notificación local) para no olvidarse de tomarla —
  disponible en la app instalada en el celular, no en la versión web.
- **M. China**: conceptos básicos de la MTC, sus hierbas y sus patrones, todo junto.
- **Info**: qué es la app y cómo usarla.

## Estructura

- `src/app/` — rutas de Expo Router (`(tabs)` = tabs de Hierbas/Síntomas/Infusiones/Mi rutina/
  M. China/Info, `herb/[id]`, `need/[id]` e `infusion/[id]` = pantallas de detalle).
- `src/data/` — contenido curado (`herbs.ts`, `needs.ts`, `infusions.ts`, `tcmConcepts.ts`).
- `src/components/` — componentes de UI reutilizables.
- `src/context/` — `AppDataContext` (favoritos y recordatorios, persistidos con AsyncStorage).
- `src/lib/` — `reminders.ts` (wrapper de `expo-notifications` para programar/cancelar recordatorios).
- `src/theme/` — colores y etiquetas de categorías/tradiciones/estilos de infusión.

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
