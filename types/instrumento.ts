export type Categoria = 'teclado' | 'percusion' | 'cuerda' | 'viento' | 'electronico';

export interface Instrumento {
  id: number;
  nombre: string;
  tipoSonido: string;
  escala: string;
  categoria: Categoria;
  imagen: string;
  link: string;
  carpetaSonidos: string;
  funcional?: boolean;
}

export interface NuevoInstrumento {
  nombre: string;
  tipoSonido: string;
  categoria: Categoria;
  escala?: string;
  imagen?: string;
  link?: string;
  carpetaSonidos?: string;
}

export interface ApiResponse {
  total: number;
  cantidad: number;
  from: number;
  datos: Instrumento[];
}
