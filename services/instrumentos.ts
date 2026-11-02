import Constants from 'expo-constants';

import type { ApiResponse, Instrumento } from '@/types/instrumento';

const API_PORT = 3000;

export function resolveApiBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) {
    return envUrl.replace(/\/$/, '');
  }

  const host = Constants.expoConfig?.hostUri
    ?.replace(/^[a-z]+:\/\//i, '')
    .split(':')[0];

  if (host) {
    return `http://${host}:${API_PORT}`;
  }

  return `http://localhost:${API_PORT}`;
}

export const API_BASE_URL = resolveApiBaseUrl();

export async function getInstrumentos(): Promise<Instrumento[]> {
  const res = await fetch(`${API_BASE_URL}/api/instrumentos?cantidad=50&from=0`);

  if (!res.ok) {
    throw new Error('No se pudo conectar al servidor.');
  }

  const data = (await res.json()) as ApiResponse;
  return data.datos ?? [];
}
