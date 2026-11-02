import { Platform, useWindowDimensions } from 'react-native';

export const BREAKPOINTS = { tablet: 600, desktop: 900 } as const;
export const MAX_CONTENT_WIDTH = 1100;
export const GRID_PADDING = 10;
export const GRID_GAP = 12;

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const columns = width >= BREAKPOINTS.desktop ? 4 : width >= BREAKPOINTS.tablet ? 3 : 2;
  const contentWidth = Math.min(width, MAX_CONTENT_WIDTH) - GRID_PADDING * 2;
  const cardWidth = Math.max(0, (contentWidth - GRID_GAP * (columns - 1)) / columns);
  const titleFontSize = Math.min(width * 0.18, 72);
  const isWeb = Platform.OS === 'web';

  return { width, height, columns, cardWidth, titleFontSize, isWeb };
}
