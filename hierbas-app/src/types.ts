export type Category =
  | 'relajante'
  | 'digestiva'
  | 'inmune'
  | 'diuretica'
  | 'antiinflamatoria'
  | 'depurativa'
  | 'estimulante'
  | 'femenina';

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
}
