export type Category =
  | 'relajante'
  | 'digestiva'
  | 'inmune'
  | 'diuretica'
  | 'antiinflamatoria'
  | 'depurativa'
  | 'estimulante'
  | 'femenina'
  | 'masculina'
  | 'tonificante'
  | 'cardiovascular'
  | 'piel'
  | 'cognitiva';

export type Tradition = 'occidental' | 'mtc' | 'ayurveda' | 'precolombina' | 'africana';

export type Kind = 'hierba' | 'fruta' | 'verdura';

export interface TcmInfo {
  naturaleza: string;
  sabor: string[];
  meridianos: string[];
  funcion: string;
}

export interface Herb {
  id: string;
  name: string;
  commonNames: string[];
  scientificName: string;
  categories: Category[];
  properties: string[];
  traditionalUses: string[];
  preparation: string;
  contraindications: string[];
  tradition: Tradition[];
  mtc?: TcmInfo;
  kind?: Kind;
}

export interface ComboIngredient {
  herbId: string;
  proportion: string;
}

export interface Combo {
  id: string;
  name: string;
  ingredients: ComboIngredient[];
  preparation: string;
  frequency: string;
  notes?: string;
}

export interface Need {
  id: string;
  name: string;
  emoji: string;
  description: string;
  combos: Combo[];
  tradition?: Tradition[];
}

export type InfusionTag =
  | 'citrica'
  | 'especiada'
  | 'frutal'
  | 'floral'
  | 'clasica'
  | 'fria'
  | 'dulce'
  | 'energizante'
  | 'relajante'
  | 'digestiva'
  | 'detox';

export interface Infusion {
  id: string;
  name: string;
  emoji: string;
  description: string;
  tags: InfusionTag[];
  ingredients: ComboIngredient[];
  preparation: string;
  servingTip?: string;
  notes?: string;
}
