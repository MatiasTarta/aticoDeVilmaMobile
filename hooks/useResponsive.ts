import { Platform, useWindowDimensions } from 'react-native';

export const BREAKPOINTS = { tablet: 600, desktop: 900 } as const;
export const MAX_CONTENT_WIDTH = 1100;
export const GRID_PADDING = 16;
export const GRID_GAP = 14;

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  // En SSR y en el primer render web, width puede ser 0.
  // Usamos un ancho de referencia para que el contenido no desaparezca.
  const effectiveWidth = width > 0 ? width : 375;
  const columns = effectiveWidth >= BREAKPOINTS.desktop ? 4 : effectiveWidth >= BREAKPOINTS.tablet ? 3 : 2;
  const contentWidth = Math.min(effectiveWidth, MAX_CONTENT_WIDTH) - GRID_PADDING * 2;
  const cardWidth = Math.max(0, (contentWidth - GRID_GAP * (columns - 1)) / columns);
  const titleFontSize = Math.min(effectiveWidth * 0.17, 88);
  const isWeb = Platform.OS === 'web';

  return { width: effectiveWidth, height, columns, cardWidth, titleFontSize, isWeb };
}
