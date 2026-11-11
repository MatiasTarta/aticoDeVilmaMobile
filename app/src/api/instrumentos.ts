import Constants from 'expo-constants';

import type { ApiResponse, Instrumento, NuevoInstrumento } from '@/types/instrumento';

const API_PORT = 3000;
const ERROR_CONEXION = 'No se pudo conectar al servidor.';
const INSTRUMENTOS_POR_PAGINA = 50;

function resolveApiBaseUrl(): string {
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

const API_BASE_URL = resolveApiBaseUrl();

async function pedir(ruta: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(`${API_BASE_URL}${ruta}`, init);
  } catch {
    throw new Error(ERROR_CONEXION);
  }
}

export async function getInstrumentos(): Promise<Instrumento[]> {
  const instrumentos: Instrumento[] = [];
  let desde = 0;
  let total = 0;

  do {
    const res = await pedir(
      `/api/instrumentos?cantidad=${INSTRUMENTOS_POR_PAGINA}&from=${desde}&incluirEnDesarrollo=1`,
    );

    if (!res.ok) {
      throw new Error('No se pudo cargar el catálogo.');
    }

    const pagina = (await res.json()) as ApiResponse;
    total = pagina.total;
    instrumentos.push(...pagina.datos);
    desde += pagina.datos.length;

    if (pagina.datos.length === 0) break;
  } while (desde < total);

  return instrumentos;
}

export async function getInstrumento(id: number): Promise<Instrumento | null> {
  const res = await pedir(`/api/instrumentos/${id}`);

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error('No se pudo cargar el instrumento.');
  }

  return (await res.json()) as Instrumento;
}

export async function crearInstrumento(datos: NuevoInstrumento): Promise<Instrumento> {
  const res = await pedir('/api/instrumentos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });

  if (res.status === 201) {
    return (await res.json()) as Instrumento;
  }

  const payload = (await res.json().catch(() => null)) as
    | { error?: string; detalles?: string[] }
    | null;
  const detalles = payload?.detalles?.length ? ` ${payload.detalles.join(' ')}` : '';
  throw new Error(`${payload?.error ?? 'No se pudo crear el instrumento.'}${detalles}`);
}
