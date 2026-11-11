import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

interface MediaQueryListLike {
  matches: boolean;
  addEventListener?: (
    type: 'change',
    listener: (event: { matches: boolean }) => void,
  ) => void;
  removeEventListener?: (
    type: 'change',
    listener: (event: { matches: boolean }) => void,
  ) => void;
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function getMatchMedia() {
  return (globalThis as { matchMedia?: (query: string) => MediaQueryListLike }).matchMedia;
}

function initialPreference(): boolean {
  if (Platform.OS !== 'web') return false;
  return getMatchMedia()?.(REDUCED_MOTION_QUERY).matches ?? false;
}

/** Respeta `prefers-reduced-motion` en web y el ajuste del sistema en nativo. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(initialPreference);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const matchMedia = getMatchMedia();
      if (!matchMedia) return;

      const query = matchMedia(REDUCED_MOTION_QUERY);
      const handleChange = (event: { matches: boolean }) => setReduced(event.matches);
      query.addEventListener?.('change', handleChange);
      return () => query.removeEventListener?.('change', handleChange);
    }

    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (active) setReduced(value);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);

    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  return reduced;
}
