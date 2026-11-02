export const colors = {
  bg: '#0a0a0a',
  surface: '#151515',
  border: '#222',
  text: '#fff',
  textMuted: '#888',
  cream: '#e8e0d5',
  muted: '#7a7068',
  teal: '#4ecdc4',
  green: '#51cf66',
  danger: '#ef5350',
  imageBg: '#1a1a1a',
} as const;

export const categoriaColors: Record<string, string> = {
  teclado: '#4ecdc4',
  percusion: '#f9a825',
  cuerda: '#ef5350',
  viento: '#ab47bc',
  electronico: '#42a5f5',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radii = { sm: 12, md: 18, pill: 100 } as const;
export const typography = {
  eyebrow: 11,
  caption: 11,
  body: 14,
  button: 16,
  subtitle: 16,
  title: 24,
} as const;

export function getCategoriaColor(categoria: string): string {
  const key = categoria
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  return categoriaColors[key] ?? colors.textMuted;
}
