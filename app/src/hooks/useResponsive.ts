import { useWindowDimensions } from 'react-native';

import { BREAKPOINTS, GRID_GAP, GRID_PADDING, MAX_CONTENT_WIDTH } from '@/theme/layout';

export function useResponsive() {
  const { width } = useWindowDimensions();
  // En SSR y en el primer render web, width puede ser 0.
  // Usamos un ancho de referencia para que el contenido no desaparezca.
  const effectiveWidth = width > 0 ? width : 375;
  const columns = effectiveWidth >= BREAKPOINTS.desktop ? 4 : effectiveWidth >= BREAKPOINTS.tablet ? 3 : 2;
  const contentWidth = Math.min(effectiveWidth, MAX_CONTENT_WIDTH) - GRID_PADDING * 2;
  const cardWidth = Math.max(0, (contentWidth - GRID_GAP * (columns - 1)) / columns);
  const titleFontSize = Math.min(effectiveWidth * 0.17, 88);

  return { width: effectiveWidth, columns, cardWidth, titleFontSize };
}
