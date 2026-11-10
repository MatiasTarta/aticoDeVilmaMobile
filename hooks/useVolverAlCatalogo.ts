import { useRouter } from 'expo-router';
import { useCallback } from 'react';

export function useVolverAlCatalogo() {
  const router = useRouter();

  return useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/cuadriculada');
    }
  }, [router]);
}
