export interface Instrument {
  id: string;
  nombre: string;
  categoria: 'teclado' | 'percusión' | 'cuerda' | 'viento' | 'electrónico';
  tipoSonido: string;
  escala?: string;
  urlImagen?: string;
  urlPagina?: string;
  carpetaSonidos?: string;
}

export const mockInstruments: Instrument[] = [
  {
    id: '1',
    nombre: 'Piano Clásico',
    categoria: 'teclado',
    tipoSonido: 'Acústico armónico',
    escala: 'Do Mayor',
    urlImagen: 'https://placehold.co/150x150/2d2d2d/4ecdc4?text=Piano',
  },
  {
    id: '2',
    nombre: 'Batería Rock',
    categoria: 'percusión',
    tipoSonido: 'Percusivo seco',
    urlImagen: 'https://placehold.co/150x150/2d2d2d/4ecdc4?text=Bateria',
  },
  {
    id: '3',
    nombre: 'Guitarra Española',
    categoria: 'cuerda',
    tipoSonido: 'Acústico cálido',
    escala: 'Re Mayor',
    urlImagen: 'https://placehold.co/150x150/2d2d2d/4ecdc4?text=Guitarra',
  },
  {
    id: '4',
    nombre: 'Trompeta Jazz',
    categoria: 'viento',
    tipoSonido: 'Metálico brillante',
    escala: 'Do Menor',
    urlImagen: 'https://placehold.co/150x150/2d2d2d/4ecdc4?text=Trompeta',
  },
  {
    id: '5',
    nombre: 'Sintetizador 80s',
    categoria: 'electrónico',
    tipoSonido: 'Digital sintético',
    urlImagen: 'https://placehold.co/150x150/2d2d2d/4ecdc4?text=Synth',
  },
  {
    id: '6',
    nombre: 'Violín Barroco',
    categoria: 'cuerda',
    tipoSonido: 'Acústico agudo',
    escala: 'Re Menor',
    urlImagen: 'https://placehold.co/150x150/2d2d2d/4ecdc4?text=Violin',
  },
  {
    id: '7',
    nombre: 'Cajón Peruano',
    categoria: 'percusión',
    tipoSonido: 'Percusivo resonante',
    urlImagen: 'https://placehold.co/150x150/2d2d2d/4ecdc4?text=Cajon',
  },
  {
    id: '8',
    nombre: 'Órgano Hammond',
    categoria: 'teclado',
    tipoSonido: 'Eléctrico vintage',
    escala: 'Do Mayor',
    urlImagen: 'https://placehold.co/150x150/2d2d2d/4ecdc4?text=Organo',
  },
  {
    id: '9',
    nombre: 'Flauta Traversa',
    categoria: 'viento',
    tipoSonido: 'Aerofónico suave',
    escala: 'Do Mayor',
    urlImagen: 'https://placehold.co/150x150/2d2d2d/4ecdc4?text=Flauta',
  },
  {
    id: '10',
    nombre: 'Bajo Eléctrico',
    categoria: 'cuerda',
    tipoSonido: 'Eléctrico profundo',
    escala: 'Do Menor',
    urlImagen: 'https://placehold.co/150x150/2d2d2d/4ecdc4?text=Bajo',
  },
  {
    id: '11',
    nombre: 'Saxofón Alto',
    categoria: 'viento',
    tipoSonido: 'Metálico expresivo',
    escala: 'Re Mayor',
    urlImagen: 'https://placehold.co/150x150/2d2d2d/4ecdc4?text=Saxo',
  },
  {
    id: '12',
    nombre: 'Arpa Celta',
    categoria: 'cuerda',
    tipoSonido: 'Acústico etéreo',
    escala: 'Do Mayor',
    urlImagen: 'https://placehold.co/150x150/2d2d2d/4ecdc4?text=Arpa',
  },
];
