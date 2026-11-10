import { type Href, useRouter } from 'expo-router';
import { useCallback } from 'react';

/**
 * Vuelve atrás si hay historial en la pila; si no (por ejemplo al abrir la
 * pantalla directamente por URL o al recargar), reemplaza por `destino`.
 */
export function useVolver(destino: Href) {
  const router = useRouter();

  return useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(destino);
    }
  }, [destino, router]);
}
