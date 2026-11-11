import type { ImageSourcePropType } from 'react-native';

import { colors } from '@/lib/theme';

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

const CATEGORIA_COLORS: Record<string, string> = {
  teclado: '#2f6f6b',
  percusion: '#8a5a12',
  cuerda: '#8c2f2f',
  viento: '#6a3d75',
  electronico: '#2b5f8a',
};

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function tipoSonidoLegible(tipo: string): string {
  const key = normalizar(tipo);
  return TIPOS_ACENTUADOS[key] ?? tipo;
}

/**
 * Tinta de sello para la categoría. Devuelve el metadato sobre papel si la
 * categoría no está mapeada.
 */
export function getCategoriaColor(categoria: string): string {
  return CATEGORIA_COLORS[normalizar(categoria)] ?? colors.inkMuted;
}
