export const colors = {
  // Penumbra cálida del ático: casi negro con sesgo madera, no gris neutro.
  bg: '#0b0908',
  bgDeep: '#070605',
  surface: '#14100d',
  surfaceRaised: '#1c1713',
  border: 'rgba(239, 230, 214, 0.10)',
  borderStrong: 'rgba(239, 230, 214, 0.20)',

  // Tinta sobre papel.
  text: '#f4ece1',
  textMuted: '#a3947f',
  cream: '#efe6d6',
  muted: '#7d6f5e',

  // Único acento de acción: luz de tungsteno.
  amber: '#d9a05b',
  amberSoft: 'rgba(217, 160, 91, 0.14)',
  teal: '#4ecdc4',
  green: '#7fbf7f',
  danger: '#c96a5a',

  // Papel de ficha de catálogo.
  paper: '#efe6d6',
  paperAlt: '#e3d6c1',
  paperEdge: '#cbbba1',
  ink: '#2b2119',
  inkMuted: '#6d5c47',
  dangerInk: '#8c3a2f',

  imageBg: '#171310',
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;

export const radii = { xs: 2, sm: 4, md: 6, lg: 10, pill: 100 } as const;

/** Familias empaquetadas; el cuerpo usa la sans del sistema. */
export const fonts = {
  display: 'Fraunces_600SemiBold',
  displayItalic: 'Fraunces_400Regular_Italic',
  mono: 'SpaceMono',
} as const;
