import Constants from 'expo-constants';

import type { ApiResponse, Instrumento, NuevoInstrumento } from '@/types/instrumento';

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
  const res = await fetch(
    `${API_BASE_URL}/api/instrumentos?cantidad=50&from=0&incluirEnDesarrollo=1`,
  );

  if (!res.ok) {
    throw new Error('No se pudo conectar al servidor.');
  }

  const data = (await res.json()) as ApiResponse;
  return data.datos ?? [];
}

export async function getInstrumento(id: number): Promise<Instrumento | null> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/api/instrumentos/${id}`);
  } catch {
    throw new Error('No se pudo conectar al servidor.');
  }

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error('No se pudo cargar el instrumento.');
  }

  return (await res.json()) as Instrumento;
}

export async function crearInstrumento(datos: NuevoInstrumento): Promise<Instrumento> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/api/instrumentos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
  } catch {
    throw new Error('No se pudo conectar al servidor.');
  }

  if (res.status === 201) {
    return (await res.json()) as Instrumento;
  }

  const payload = (await res.json().catch(() => null)) as
    | { error?: string; detalles?: string[] }
    | null;
  const detalles = payload?.detalles?.length ? ` ${payload.detalles.join(' ')}` : '';
  throw new Error(`${payload?.error ?? 'No se pudo crear el instrumento.'}${detalles}`);
}
