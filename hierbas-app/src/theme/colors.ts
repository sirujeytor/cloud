import { Kind, Tradition } from '../types';

export const colors = {
  background: '#F7F3E9',
  surface: '#FFFFFF',
  primary: '#4C7A50',
  primaryDark: '#33562F',
  secondary: '#C98F4B',
  text: '#2B2B25',
  textMuted: '#6B6B5F',
  border: '#E3DCC8',
  danger: '#8A4B3B',
  chipBg: '#EAF1E4',
  chipText: '#33562F',
};

export const categoryLabels: Record<string, string> = {
  relajante: 'Relajante',
  digestiva: 'Digestiva',
  inmune: 'Defensas',
  diuretica: 'Diurética',
  antiinflamatoria: 'Antiinflamatoria',
  depurativa: 'Depurativa',
  estimulante: 'Estimulante',
  femenina: 'Ciclo femenino',
  masculina: 'Salud masculina',
  tonificante: 'Tonificante',
  cardiovascular: 'Cardiovascular',
  piel: 'Piel',
  cognitiva: 'Cognitiva',
};

export const traditionLabels: Record<Tradition, string> = {
  occidental: 'Occidental',
  mtc: 'Medicina china',
  ayurveda: 'Ayurveda',
  precolombina: 'Culturas de América',
  africana: 'Medicina africana',
};

export const traditionBadgeLabels: Record<Tradition, string> = {
  occidental: 'OCCIDENTAL',
  mtc: 'MTC',
  ayurveda: 'AYURVEDA',
  precolombina: 'AMÉRICA',
  africana: 'ÁFRICA',
};

export const traditionBadgeColors: Record<Tradition, string> = {
  occidental: '#4C7A50',
  mtc: '#C98F4B',
  ayurveda: '#B8621B',
  precolombina: '#B5533C',
  africana: '#2C6E8C',
};

export const kindLabels: Record<Kind, string> = {
  hierba: 'Hierba',
  fruta: 'Fruta',
  verdura: 'Verdura',
};

export const kindBadgeColors: Record<Kind, string> = {
  hierba: colors.primary,
  fruta: '#C4433C',
  verdura: '#5B8A3A',
};
