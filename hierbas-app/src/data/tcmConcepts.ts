export interface TcmConcept {
  id: string;
  title: string;
  emoji: string;
  text: string;
}

export const tcmConcepts: TcmConcept[] = [
  {
    id: 'qi',
    title: 'Qi (energía vital)',
    emoji: '⚡',
    text:
      'El Qi es la energía que, según la Medicina Tradicional China (MTC), sostiene todas las funciones del cuerpo: respirar, digerir, pensar, moverse. Cuando el Qi está bajo aparece cansancio; cuando está "estancado" (por ejemplo, por estrés) aparece tensión e irritabilidad.',
  },
  {
    id: 'yin-yang',
    title: 'Yin y Yang',
    emoji: '☯️',
    text:
      'Yin y Yang son dos fuerzas complementarias y opuestas. El Yin es lo frío, húmedo, quieto y nutritivo; el Yang es lo cálido, activo y transformador. La salud, en la MTC, es un equilibrio dinámico entre ambos: un exceso o una falta de cualquiera de los dos genera desequilibrio.',
  },
  {
    id: 'cinco-elementos',
    title: 'Los 5 Elementos',
    emoji: '🌳',
    text:
      'Madera, Fuego, Tierra, Metal y Agua son cinco "fases" que la MTC usa para describir los órganos, las emociones y las estaciones. Por ejemplo: la Madera se asocia al Hígado y a la emoción de la ira/frustración; el Agua, al Riñón y a la voluntad. Cada elemento nutre al siguiente y controla a otro, como un sistema en equilibrio.',
  },
  {
    id: 'sabores',
    title: 'Los 5 sabores',
    emoji: '👅',
    text:
      'En la MTC cada sabor actúa sobre un órgano y una dirección: el picante dispersa y mueve (Pulmón), el dulce tonifica (Bazo), el amargo seca y hace descender (Corazón), el ácido astringe (Hígado) y el salado ablanda y hace descender (Riñón). Por eso una combinación de hierbas suele buscar varios sabores a la vez.',
  },
  {
    id: 'naturaleza-termica',
    title: 'La naturaleza térmica',
    emoji: '🌡️',
    text:
      'Además del sabor, cada hierba tiene una "naturaleza": fría, fresca, neutra, tibia o caliente. Se elige una hierba de naturaleza cálida para un cuadro de frío (manos frías, cansancio, digestión lenta) y una hierba fresca o fría para un cuadro de calor (sofocos, irritabilidad, boca seca).',
  },
  {
    id: 'meridianos',
    title: 'Meridianos y órganos (Zang-Fu)',
    emoji: '🧭',
    text:
      'Los meridianos son canales por donde circula el Qi y que conectan la superficie del cuerpo con los órganos internos. Cuando se dice que una hierba "entra" en el meridiano del Hígado o del Riñón, se refiere a que su acción se dirige principalmente a la función de ese órgano según la MTC.',
  },
];
