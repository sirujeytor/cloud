import { Combo, Need } from '../types';

export const needs: Need[] = [
  {
    id: 'ansiedad-estres',
    name: 'Ansiedad y estrés',
    emoji: '😌',
    description:
      'Para esos días en los que la cabeza no para y el cuerpo está en alerta. Estas combinaciones se usan tradicionalmente para bajar un cambio.',
    combos: [
      {
        id: 'calma-tres-hierbas',
        name: 'Calma en 3 hierbas',
        ingredients: [
          { herbId: 'tilo', proportion: '1 parte' },
          { herbId: 'melisa', proportion: '1 parte' },
          { herbId: 'pasiflora', proportion: '1 parte' },
        ],
        preparation: 'Mezclar partes iguales. Usar 1 cucharada de la mezcla por taza de agua caliente. Infusionar tapado 8 minutos.',
        frequency: '1-2 tazas al día, en los momentos de mayor tensión.',
        notes: 'Si ya tomás ansiolíticos o sedantes, consultá antes con tu médico por posible efecto sumado.',
      },
      {
        id: 'noche-tranquila-ansiedad',
        name: 'Bajar revoluciones',
        ingredients: [
          { herbId: 'manzanilla', proportion: '1 parte' },
          { herbId: 'lavanda', proportion: '1/2 parte' },
          { herbId: 'melisa', proportion: '1 parte' },
        ],
        preparation: 'Mezclar y usar 1 cucharadita de la mezcla por taza. Infusionar 5-8 minutos.',
        frequency: '1 taza a media tarde y otra después de cenar.',
      },
    ],
  },
  {
    id: 'insomnio',
    name: 'Insomnio y mejorar el sueño',
    emoji: '🌙',
    description: 'Combinaciones pensadas para tomar antes de dormir y favorecer un sueño más profundo.',
    combos: [
      {
        id: 'noche-profunda',
        name: 'Noche profunda',
        ingredients: [
          { herbId: 'valeriana', proportion: '1 parte' },
          { herbId: 'pasiflora', proportion: '1 parte' },
          { herbId: 'tilo', proportion: '1 parte' },
        ],
        preparation: 'Mezclar partes iguales. 1 cucharadita de la mezcla por taza. Infusionar tapado 10 minutos.',
        frequency: '1 taza, 30-45 minutos antes de acostarse.',
        notes: 'No combinar con alcohol. Puede dar somnolencia: no manejar después de tomarla.',
      },
      {
        id: 'ritual-dulce-sueño',
        name: 'Ritual dulce para dormir',
        ingredients: [
          { herbId: 'manzanilla', proportion: '1 parte' },
          { herbId: 'lavanda', proportion: '1/2 parte' },
          { herbId: 'melisa', proportion: '1 parte' },
        ],
        preparation: 'Mezclar y usar 1 cucharadita por taza. Infusionar 5-8 minutos, sin pantallas mientras se toma.',
        frequency: '1 taza antes de dormir, como parte de una rutina relajante.',
      },
    ],
  },
  {
    id: 'digestion',
    name: 'Digestión pesada e hinchazón',
    emoji: '🍽️',
    description: 'Para después de comidas abundantes, gases o esa sensación de "piedra en el estómago".',
    combos: [
      {
        id: 'post-comida',
        name: 'Post comida pesada',
        ingredients: [
          { herbId: 'boldo', proportion: '1/2 parte' },
          { herbId: 'peperina', proportion: '1 parte' },
          { herbId: 'menta', proportion: '1 parte' },
        ],
        preparation: 'Mezclar y usar 1 cucharadita por taza. Infusionar 5-8 minutos.',
        frequency: '1 taza después de la comida principal. No usar de forma continua por más de 2 semanas.',
        notes: 'El boldo no se recomienda en embarazo, lactancia ni problemas hepáticos o biliares diagnosticados.',
      },
      {
        id: 'gases-hinchazon',
        name: 'Contra gases e hinchazón',
        ingredients: [
          { herbId: 'hinojo', proportion: '1 parte' },
          { herbId: 'anis-estrellado', proportion: '1/2 parte' },
          { herbId: 'cedron', proportion: '1 parte' },
        ],
        preparation: 'Machacar un poco las semillas de hinojo y el anís. Hervir 5-8 minutos junto con el cedrón.',
        frequency: '1 taza después de las comidas.',
      },
    ],
  },
  {
    id: 'resfrio-defensas',
    name: 'Resfrío y defensas bajas',
    emoji: '🤧',
    description: 'Para acompañar los primeros síntomas de resfrío y dar una mano a las defensas.',
    combos: [
      {
        id: 'escudo-invierno',
        name: 'Escudo de invierno',
        ingredients: [
          { herbId: 'jengibre', proportion: '1 parte' },
          { herbId: 'equinacea', proportion: '1 parte' },
          { herbId: 'tilo', proportion: '1 parte' },
        ],
        preparation: 'Hervir el jengibre 5 minutos, apagar el fuego, agregar la equinácea y el tilo. Reposar 8 minutos tapado.',
        frequency: '2-3 tazas al día durante los primeros días de síntomas, en cursos de no más de 7-10 días.',
        notes: 'La equinácea no se recomienda en enfermedades autoinmunes sin consultar a un médico.',
      },
      {
        id: 'garganta-abrigada',
        name: 'Garganta abrigada',
        ingredients: [
          { herbId: 'jengibre', proportion: '1 parte' },
          { herbId: 'menta', proportion: '1/2 parte' },
        ],
        preparation: 'Hervir el jengibre 5 minutos, agregar la menta al apagar y dejar reposar 5 minutos más.',
        frequency: '2 tazas al día, bien calientes.',
      },
      {
        id: 'vitamina-c-extra',
        name: 'Vitamina C extra',
        ingredients: [
          { herbId: 'jengibre', proportion: '1 parte' },
          { herbId: 'rosa-mosqueta', proportion: '1 parte' },
          { herbId: 'naranja', proportion: '1/2 parte' },
          { herbId: 'equinacea', proportion: '1/2 parte' },
        ],
        preparation:
          'Hervir el jengibre 5 minutos, agregar la rosa mosqueta y la cáscara de naranja, hervir 5 minutos más, apagar y agregar la equinácea. Reposar 5 minutos tapado.',
        frequency: '2 tazas al día durante los primeros días de síntomas, en cursos de no más de 7-10 días.',
        notes: 'La equinácea no se recomienda en enfermedades autoinmunes sin consultar a un médico.',
      },
    ],
  },
  {
    id: 'dolor-cabeza',
    name: 'Dolor de cabeza y tensión',
    emoji: '🤕',
    description: 'Para el dolor de cabeza leve asociado a tensión, tomado con calma en un lugar tranquilo.',
    combos: [
      {
        id: 'alivio-sien',
        name: 'Alivio de sien',
        ingredients: [
          { herbId: 'menta', proportion: '1 parte' },
          { herbId: 'manzanilla', proportion: '1 parte' },
          { herbId: 'romero', proportion: '1/2 parte' },
        ],
        preparation: 'Mezclar y usar 1 cucharadita por taza. Infusionar 5-8 minutos.',
        frequency: '1 taza apenas empieza la molestia.',
      },
      {
        id: 'tension-abajo',
        name: 'Bajar la tensión',
        ingredients: [
          { herbId: 'lavanda', proportion: '1/2 parte' },
          { herbId: 'tilo', proportion: '1 parte' },
          { herbId: 'menta', proportion: '1/2 parte' },
        ],
        preparation: 'Mezclar y usar 1 cucharadita por taza. Infusionar 5-8 minutos en un ambiente tranquilo.',
        frequency: '1 taza cuando el dolor está asociado a estrés o tensión acumulada.',
      },
    ],
  },
  {
    id: 'retencion-liquidos',
    name: 'Retención de líquidos',
    emoji: '💧',
    description: 'Combinaciones diuréticas suaves, pensadas para tomar durante el día.',
    combos: [
      {
        id: 'drenaje-suave',
        name: 'Drenaje suave',
        ingredients: [
          { herbId: 'cola-de-caballo', proportion: '1 parte' },
          { herbId: 'diente-de-leon', proportion: '1 parte' },
          { herbId: 'hinojo', proportion: '1/2 parte' },
        ],
        preparation: 'Hervir 5-8 minutos. Colar bien.',
        frequency: '1-2 tazas al día, en cursos de no más de 2-3 semanas seguidas.',
        notes: 'Si tomás medicación para la presión o problemas renales, consultá antes por el efecto diurético.',
      },
      {
        id: 'piernas-livianas',
        name: 'Piernas livianas',
        ingredients: [
          { herbId: 'diente-de-leon', proportion: '1 parte' },
          { herbId: 'ortiga', proportion: '1/2 parte' },
          { herbId: 'cedron', proportion: '1 parte' },
        ],
        preparation: 'Hervir el diente de león y la ortiga 5 minutos, agregar el cedrón y reposar 3 minutos más.',
        frequency: '1 taza a la mañana y otra a media tarde.',
      },
      {
        id: 'infusion-verde',
        name: 'Infusión verde',
        ingredients: [
          { herbId: 'cola-de-caballo', proportion: '1 parte' },
          { herbId: 'apio-semillas', proportion: '1/2 parte' },
          { herbId: 'diente-de-leon', proportion: '1 parte' },
          { herbId: 'pepino', proportion: '2 rodajas' },
        ],
        preparation:
          'Hervir la cola de caballo, el apio y el diente de león 8 minutos. Dejar entibiar y agregar las rodajas de pepino recién al final, sin hervirlas.',
        frequency: '1-2 tazas al día, en cursos de no más de 2-3 semanas seguidas.',
        notes: 'Las semillas de apio no se recomiendan en embarazo. Si tomás medicación para la presión o problemas renales, consultá antes por el efecto diurético.',
      },
    ],
  },
  {
    id: 'purificacion-detox',
    name: 'Purificación y detox hepático',
    emoji: '🌿',
    description: 'Combinaciones tradicionalmente usadas como "cura depurativa" de unos días, para dar un respiro al hígado.',
    combos: [
      {
        id: 'reset-higado',
        name: 'Reset para el hígado',
        ingredients: [
          { herbId: 'boldo', proportion: '1/2 parte' },
          { herbId: 'carqueja', proportion: '1 parte' },
          { herbId: 'diente-de-leon', proportion: '1 parte' },
        ],
        preparation: 'Hervir 5-8 minutos. El sabor es amargo; se puede endulzar levemente con miel.',
        frequency: '1 taza antes de las comidas principales, en cursos de 5 a 7 días.',
        notes: 'No recomendado en embarazo, lactancia, ni problemas hepáticos o biliares diagnosticados. No usar de forma continua.',
      },
      {
        id: 'dia-liviano',
        name: 'Día liviano',
        ingredients: [
          { herbId: 'diente-de-leon', proportion: '1 parte' },
          { herbId: 'cedron', proportion: '1 parte' },
          { herbId: 'menta', proportion: '1/2 parte' },
        ],
        preparation: 'Hervir el diente de león 5 minutos, agregar el cedrón y la menta, reposar 3 minutos más.',
        frequency: '1-2 tazas al día, con las comidas.',
      },
      {
        id: 'detox-citrico',
        name: 'Detox cítrico',
        ingredients: [
          { herbId: 'alcachofa-hojas', proportion: '1 parte' },
          { herbId: 'diente-de-leon', proportion: '1 parte' },
          { herbId: 'limon', proportion: '1/2 parte' },
          { herbId: 'pepino', proportion: '2 rodajas' },
        ],
        preparation:
          'Hervir la alcachofa y el diente de león 8-10 minutos. Dejar entibiar, agregar el jugo y la cáscara de limón, y las rodajas de pepino al final.',
        frequency: '1 taza antes de las comidas principales, en cursos de 5 a 7 días.',
        notes: 'No recomendado en cálculos biliares u obstrucción de las vías biliares, ni en embarazo o lactancia sin consultar antes.',
      },
    ],
  },
  {
    id: 'dolores-menstruales',
    name: 'Dolores menstruales',
    emoji: '🌸',
    description: 'Para acompañar los días de ciclo con más molestias.',
    combos: [
      {
        id: 'calma-ciclo',
        name: 'Calma para el ciclo',
        ingredients: [
          { herbId: 'salvia', proportion: '1/2 parte' },
          { herbId: 'manzanilla', proportion: '1 parte' },
          { herbId: 'jengibre', proportion: '1/2 parte' },
        ],
        preparation: 'Hervir el jengibre 5 minutos, agregar la salvia y la manzanilla, reposar 5 minutos tapado.',
        frequency: '2-3 tazas al día durante los días de molestia, sin extender más de una semana por mes.',
        notes: 'La salvia no se recomienda en embarazo ni lactancia.',
      },
      {
        id: 'abrigo-abdominal',
        name: 'Abrigo abdominal',
        ingredients: [
          { herbId: 'manzanilla', proportion: '1 parte' },
          { herbId: 'jengibre', proportion: '1/2 parte' },
          { herbId: 'melisa', proportion: '1 parte' },
        ],
        preparation: 'Hervir el jengibre 5 minutos, apagar y agregar la manzanilla y la melisa. Reposar 5-8 minutos.',
        frequency: '2 tazas al día, bien calientes, acompañado de calor local en el abdomen.',
      },
    ],
  },
  {
    id: 'antioxidante-vitamina-c',
    name: 'Antioxidante y vitamina C',
    emoji: '🍊',
    description:
      'Combinaciones pensadas con frutas, además de hierbas, para sumar vitamina C y antioxidantes al día. Ideales para variar el sabor de las infusiones de todos los días.',
    combos: [
      {
        id: 'escudo-citrico',
        name: 'Escudo cítrico',
        ingredients: [
          { herbId: 'rosa-mosqueta', proportion: '1 parte' },
          { herbId: 'hibisco', proportion: '1/2 parte' },
          { herbId: 'naranja', proportion: '1/2 parte' },
          { herbId: 'jengibre', proportion: '1/2 parte' },
        ],
        preparation:
          'Hervir el jengibre 5 minutos, agregar la rosa mosqueta, el hibisco y la cáscara de naranja, hervir 5 minutos más. Colar bien.',
        frequency: '1-2 tazas al día. Se puede tomar fría en verano.',
      },
      {
        id: 'antioxidante-total',
        name: 'Antioxidante total',
        ingredients: [
          { herbId: 'arandanos', proportion: '1 parte' },
          { herbId: 'hibisco', proportion: '1/2 parte' },
          { herbId: 'limon', proportion: '1/2 parte' },
          { herbId: 'canela', proportion: '1/4 parte' },
        ],
        preparation: 'Hervir los arándanos, el hibisco y la canela 8-10 minutos. Agregar la cáscara y el jugo de limón al final.',
        frequency: '1 taza al día, ideal a media mañana.',
        notes: 'El hibisco puede sumar efecto con la medicación para la presión: consultar si la tomás de forma regular.',
      },
    ],
  },
  {
    id: 'relajacion-fin-dia',
    name: 'Relajación de fin del día',
    emoji: '🍵',
    description: 'Un ritual simple para cerrar el día y bajar el ritmo antes de la noche.',
    combos: [
      {
        id: 'cierre-de-dia',
        name: 'Cierre de día',
        ingredients: [
          { herbId: 'melisa', proportion: '1 parte' },
          { herbId: 'manzanilla', proportion: '1 parte' },
          { herbId: 'cedron', proportion: '1 parte' },
        ],
        preparation: 'Mezclar partes iguales. 1 cucharadita por taza. Infusionar 5-8 minutos.',
        frequency: '1 taza después de cenar, sin pantallas, como cierre de la jornada.',
      },
      {
        id: 'nube-lavanda',
        name: 'Nube de lavanda',
        ingredients: [
          { herbId: 'lavanda', proportion: '1/2 parte' },
          { herbId: 'tilo', proportion: '1 parte' },
          { herbId: 'pasiflora', proportion: '1/2 parte' },
        ],
        preparation: 'Mezclar y usar 1 cucharadita por taza. Infusionar tapado 8 minutos.',
        frequency: '1 taza a la noche, en un ambiente tranquilo y con poca luz.',
      },
    ],
  },
  {
    id: 'energia-sin-cafeina',
    name: 'Energía y vitalidad sin cafeína',
    emoji: '⚡',
    description: 'Para los días de bajón, sin recurrir a la cafeína.',
    combos: [
      {
        id: 'impulso-natural',
        name: 'Impulso natural',
        ingredients: [
          { herbId: 'romero', proportion: '1 parte' },
          { herbId: 'jengibre', proportion: '1/2 parte' },
          { herbId: 'menta', proportion: '1/2 parte' },
        ],
        preparation: 'Hervir el jengibre 5 minutos, agregar el romero y la menta, reposar 5 minutos más.',
        frequency: '1 taza a la mañana o a media tarde. Evitar tomarla muy tarde por su efecto estimulante suave.',
      },
      {
        id: 'vitalidad-mineral',
        name: 'Vitalidad mineral',
        ingredients: [
          { herbId: 'ortiga', proportion: '1 parte' },
          { herbId: 'romero', proportion: '1/2 parte' },
          { herbId: 'cedron', proportion: '1 parte' },
        ],
        preparation: 'Hervir la ortiga 5 minutos, agregar el romero y el cedrón, reposar 3 minutos más.',
        frequency: '1 taza al día, ideal en épocas de cansancio general.',
      },
    ],
  },

  // --- Patrones según la Medicina Tradicional China (MTC) ---
  {
    id: 'mtc-qi-bajo',
    name: 'Cansancio profundo (Qi bajo)',
    emoji: '🧘',
    description:
      'Según la MTC, cuando el Qi (la energía vital) está bajo aparece cansancio que no se va con dormir, poco apetito, voz débil y resfríos frecuentes.',
    tradition: ['mtc'],
    combos: [
      {
        id: 'tonico-de-qi',
        name: 'Tónico de Qi',
        ingredients: [
          { herbId: 'ginseng', proportion: '1 parte' },
          { herbId: 'astragalo', proportion: '1 parte' },
          { herbId: 'azufaifo', proportion: '1 parte' },
        ],
        preparation: 'Hervir a fuego bajo, tapado, 15-20 minutos (decocción tradicional).',
        frequency: '1 taza al día, en cursos de 2-3 semanas con una semana de descanso.',
        notes: 'El ginseng no se recomienda junto a estimulantes en exceso ni en hipertensión no controlada.',
      },
      {
        id: 'fuerza-diaria',
        name: 'Fuerza diaria',
        ingredients: [
          { herbId: 'astragalo', proportion: '1 parte' },
          { herbId: 'regaliz-chino', proportion: '1/2 parte' },
          { herbId: 'jengibre', proportion: '1/2 parte' },
        ],
        preparation: 'Hervir 10-15 minutos.',
        frequency: '1 taza al día, ideal en épocas de mucho desgaste físico o mental.',
      },
    ],
  },
  {
    id: 'mtc-yin-bajo',
    name: 'Sequedad y calor nocturno (Yin bajo)',
    emoji: '🌙',
    description:
      'El Yin es lo que enfría y humedece el cuerpo. Cuando está bajo pueden aparecer sudores nocturnos, boca y garganta secas, inquietud al acostarse y sensación de calor por la tarde-noche.',
    tradition: ['mtc'],
    combos: [
      {
        id: 'nutrir-el-yin',
        name: 'Nutrir el Yin',
        ingredients: [
          { herbId: 'goji', proportion: '1 parte' },
          { herbId: 'crisantemo', proportion: '1/2 parte' },
          { herbId: 'regaliz-chino', proportion: '1/4 parte' },
        ],
        preparation: 'Infusionar/hervir 8-10 minutos.',
        frequency: '1 taza a la tarde y otra antes de dormir.',
      },
      {
        id: 'frescura-nocturna',
        name: 'Frescura nocturna',
        ingredients: [
          { herbId: 'goji', proportion: '1 parte' },
          { herbId: 'he-shou-wu', proportion: '1/2 parte' },
          { herbId: 'crisantemo', proportion: '1/2 parte' },
        ],
        preparation: 'Hervir 15 minutos.',
        frequency: '1 taza al día, en cursos de 2-3 semanas.',
        notes: 'Usar únicamente He Shou Wu procesado (Zhi He Shou Wu) de fuente confiable.',
      },
    ],
  },
  {
    id: 'mtc-qi-higado-estancado',
    name: 'Tensión emocional e irritabilidad (Qi del hígado estancado)',
    emoji: '😤',
    description:
      'En la MTC, el estrés sostenido o las emociones contenidas "estancan" el Qi del hígado: aparece irritabilidad, opresión en el pecho o las costillas, suspiros frecuentes y cambios de humor.',
    tradition: ['mtc'],
    combos: [
      {
        id: 'libre-circular',
        name: 'Libre circular',
        ingredients: [
          { herbId: 'chai-hu', proportion: '1 parte' },
          { herbId: 'menta', proportion: '1/2 parte' },
          { herbId: 'regaliz-chino', proportion: '1/4 parte' },
        ],
        preparation: 'Hervir el bupleurum 10 minutos, apagar y agregar la menta y el regaliz 3 minutos más.',
        frequency: '1 taza al día, en los períodos de más tensión.',
        notes: 'No recomendado en embarazo ni en hipertensión no controlada sin supervisión.',
      },
      {
        id: 'aire-fresco-emocional',
        name: 'Aire fresco',
        ingredients: [
          { herbId: 'crisantemo', proportion: '1 parte' },
          { herbId: 'melisa', proportion: '1 parte' },
          { herbId: 'regaliz-chino', proportion: '1/4 parte' },
        ],
        preparation: 'Infusionar 8 minutos.',
        frequency: '1-2 tazas al día.',
      },
    ],
  },
  {
    id: 'mtc-humedad-flema',
    name: 'Pesadez y digestión lenta (humedad-flema)',
    emoji: '🌫️',
    description:
      'Cuando el Bazo no transforma bien los líquidos, la MTC habla de acumulación de "humedad": hinchazón, pesadez, cabeza como algodón y mucosidad abundante.',
    tradition: ['mtc'],
    combos: [
      {
        id: 'seca-la-humedad',
        name: 'Seca la humedad',
        ingredients: [
          { herbId: 'chen-pi', proportion: '1 parte' },
          { herbId: 'jengibre', proportion: '1/2 parte' },
          { herbId: 'regaliz-chino', proportion: '1/4 parte' },
        ],
        preparation: 'Hervir el jengibre 5 minutos, agregar la cáscara de mandarina y el regaliz, reposar 5 minutos más.',
        frequency: '1 taza después de las comidas más pesadas.',
      },
      {
        id: 'cabeza-liviana',
        name: 'Cabeza liviana',
        ingredients: [
          { herbId: 'chen-pi', proportion: '1 parte' },
          { herbId: 'menta', proportion: '1/2 parte' },
        ],
        preparation: 'Infusionar 8 minutos.',
        frequency: '1 taza a media mañana.',
      },
    ],
  },
  {
    id: 'mtc-yang-rinon-bajo',
    name: 'Frío y baja energía vital (Yang del riñón bajo)',
    emoji: '❄️',
    description:
      'El Yang del riñón es, según la MTC, el "fuego" que calienta todo el cuerpo. Cuando está bajo aparecen manos y pies fríos, lumbago, energía vital y sexual baja, y más sensibilidad al frío.',
    tradition: ['mtc'],
    combos: [
      {
        id: 'fuego-interior',
        name: 'Fuego interior',
        ingredients: [
          { herbId: 'canela', proportion: '1 parte' },
          { herbId: 'ginseng', proportion: '1/2 parte' },
          { herbId: 'jengibre', proportion: '1/2 parte' },
        ],
        preparation: 'Hervir 10-15 minutos.',
        frequency: '1 taza al día, preferentemente por la mañana, en épocas frías.',
        notes: 'Evitar si hay signos de "calor" (sofocos, boca seca, cara roja) según la MTC.',
      },
      {
        id: 'calor-de-fondo',
        name: 'Calor de fondo',
        ingredients: [
          { herbId: 'astragalo', proportion: '1 parte' },
          { herbId: 'canela', proportion: '1/2 parte' },
          { herbId: 'azufaifo', proportion: '1 parte' },
        ],
        preparation: 'Hervir 12-15 minutos.',
        frequency: '1 taza al día durante el invierno o en épocas de mucho cansancio.',
      },
    ],
  },
  {
    id: 'mtc-defensas-wei-qi',
    name: 'Fortalecer las defensas (Wei Qi)',
    emoji: '🛡️',
    description:
      'El Wei Qi es, según la MTC, la capa de energía defensiva que protege la superficie del cuerpo. Fortalecerla ayuda a resfriarse con menos frecuencia.',
    tradition: ['mtc'],
    combos: [
      {
        id: 'escudo-wei-qi',
        name: 'Escudo de Wei Qi',
        ingredients: [
          { herbId: 'astragalo', proportion: '1 parte' },
          { herbId: 'jengibre', proportion: '1/2 parte' },
          { herbId: 'regaliz-chino', proportion: '1/4 parte' },
        ],
        preparation: 'Hervir 10-15 minutos. Versión simplificada e inspirada en la fórmula clásica Yu Ping Feng San.',
        frequency: '1 taza al día, en cursos de 2-3 semanas al empezar el otoño o el invierno.',
        notes: 'No usar durante un resfrío con fiebre activa: en MTC el astrágalo se usa para prevenir, no en la fase aguda.',
      },
      {
        id: 'oriente-occidente',
        name: 'Oriente-Occidente',
        ingredients: [
          { herbId: 'astragalo', proportion: '1 parte' },
          { herbId: 'equinacea', proportion: '1 parte' },
          { herbId: 'jengibre', proportion: '1/2 parte' },
        ],
        preparation: 'Hervir el jengibre 5 minutos, agregar el astrágalo y la equinácea, reposar 8 minutos más.',
        frequency: '1-2 tazas al día, en cursos cortos de 7-10 días.',
      },
    ],
  },
  {
    id: 'mtc-shen',
    name: 'Calmar la mente y el espíritu (Shen)',
    emoji: '🕯️',
    description:
      'En la MTC, el Shen es la mente/el espíritu alojado en el Corazón. Cuando está agitado aparece insomnio con sueños intensos, palpitaciones leves por nervios y una sensación de "cabeza que no se apaga".',
    tradition: ['mtc'],
    combos: [
      {
        id: 'ancla-del-shen',
        name: 'Ancla del Shen',
        ingredients: [
          { herbId: 'reishi', proportion: '1 parte' },
          { herbId: 'azufaifo', proportion: '1 parte' },
          { herbId: 'regaliz-chino', proportion: '1/4 parte' },
        ],
        preparation: 'Hervir a fuego bajo 15-20 minutos.',
        frequency: '1 taza por la tarde y otra antes de dormir.',
      },
      {
        id: 'quietud',
        name: 'Quietud',
        ingredients: [
          { herbId: 'reishi', proportion: '1 parte' },
          { herbId: 'goji', proportion: '1/2 parte' },
          { herbId: 'crisantemo', proportion: '1/2 parte' },
        ],
        preparation: 'Hervir 15 minutos.',
        frequency: '1 taza antes de dormir.',
      },
    ],
  },
];

export const getNeedById = (id: string): Need | undefined => needs.find((n) => n.id === id);

export const getComboWithNeed = (comboId: string): { need: Need; combo: Combo } | undefined => {
  for (const need of needs) {
    const combo = need.combos.find((c) => c.id === comboId);
    if (combo) return { need, combo };
  }
  return undefined;
};
