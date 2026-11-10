import type { ImageSourcePropType } from 'react-native';

const IMAGENES_LOCALES: Record<string, ImageSourcePropType> = {
  'piano.png': require('../../assets/images/piano.jpg'),
  'bateria.png': require('../../assets/images/bateria.jpg'),
  'pianoPsicodelico.png': require('../../assets/images/pianoPsicodelico.jpg'),
  'placeholder.png': require('../../assets/images/placeholder.jpg'),
};

export function resolveImagen(imagen: string): ImageSourcePropType {
  const archivo = imagen.split('/').pop() ?? '';
  return IMAGENES_LOCALES[archivo] ?? IMAGENES_LOCALES['placeholder.png'];
}

export function serial(id: number): string {
  return `N.º ${String(id).padStart(3, '0')}`;
}

const TIPOS_ACENTUADOS: Record<string, string> = {
  acustico: 'acústico',
  psicodelico: 'psicodélico',
  electronico: 'electrónico',
  percusion: 'percusión',
};

export function tipoSonidoLegible(tipo: string): string {
  const key = tipo
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  return TIPOS_ACENTUADOS[key] ?? tipo;
}
