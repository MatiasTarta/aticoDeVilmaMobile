let instrumentos = [
  // Instrumentos funcionales
  {
    id: 1,
    nombre: "Piano Clásico",
    tipoSonido: "acustico",
    escala: "ninguna",
    categoria: "teclado",
    imagen: "../assets/img/piano.png",
    link: "./individualPiano.html",
    carpetaSonidos: "../assets/sonidos/piano/"
  },
  {
    id: 2,
    nombre: "Batería Rock",
    tipoSonido: "rock",
    escala: "ninguna",
    categoria: "percusion",
    imagen: "../assets/img/bateria.png",
    link: "./individualBateria.html",
    carpetaSonidos: "../assets/sonidos/drumkit/"
  },
  {
    id: 3,
    nombre: "Piano Psicodélico",
    tipoSonido: "psicodelico",
    escala: "ninguna",
    categoria: "teclado",
    imagen: "../assets/img/pianoPsicodelico.png",
    link: "./individualPianoSonidos.html",
    carpetaSonidos: "../assets/sonidos/pianoPsico/"
  },
  
  // Instrumentos adicionales (no funcionales, solo visuales)
  {
    id: 4,
    nombre: "Guitarra Acústica",
    tipoSonido: "acustico",
    escala: "ninguna",
    categoria: "cuerda",
    imagen: "../assets/img/guitarra.png",
    link: "./enDesarrollo.html",
    carpetaSonidos: "../assets/sonidos/guitarra/"
  },
  {
    id: 5,
    nombre: "Guitarra Eléctrica",
    tipoSonido: "rock",
    escala: "ninguna",
    categoria: "cuerda",
    imagen: "../assets/img/guitarraElectrica.png",
    link: "./enDesarrollo.html",
    carpetaSonidos: "../assets/sonidos/guitarraElec/"
  },
  {
    id: 6,
    nombre: "Bajo Eléctrico",
    tipoSonido: "electronico",
    escala: "ninguna",
    categoria: "cuerda",
    imagen: "../assets/img/bajo.png",
    link: "./enDesarrollo.html",
    carpetaSonidos: "../assets/sonidos/bajo/"
  },
  {
    id: 7,
    nombre: "Saxofón Alto",
    tipoSonido: "jazz",
    escala: "ninguna",
    categoria: "viento",
    imagen: "../assets/img/saxofon.png",
    link: "./enDesarrollo.html",
    carpetaSonidos: "../assets/sonidos/saxofon/"
  },
  {
    id: 8,
    nombre: "Trompeta",
    tipoSonido: "clasico",
    escala: "ninguna",
    categoria: "viento",
    imagen: "../assets/img/trompeta.png",
    link: "./enDesarrollo.html",
    carpetaSonidos: "../assets/sonidos/trompeta/"
  },
  {
    id: 9,
    nombre: "Violín",
    tipoSonido: "clasico",
    escala: "ninguna",
    categoria: "cuerda",
    imagen: "../assets/img/violin.png",
    link: "./enDesarrollo.html",
    carpetaSonidos: "../assets/sonidos/violin/"
  },
  {
    id: 10,
    nombre: "Flauta Traversa",
    tipoSonido: "clasico",
    escala: "ninguna",
    categoria: "viento",
    imagen: "../assets/img/flauta.png",
    link: "./enDesarrollo.html",
    carpetaSonidos: "../assets/sonidos/flauta/"
  },
  {
    id: 11,
    nombre: "Acordeón",
    tipoSonido: "folk",
    escala: "ninguna",
    categoria: "viento",
    imagen: "../assets/img/acordeon.png",
    link: "./enDesarrollo.html",
    carpetaSonidos: "../assets/sonidos/acordeon/"
  },
  {
    id: 12,
    nombre: "Arpa",
    tipoSonido: "clasico",
    escala: "ninguna",
    categoria: "cuerda",
    imagen: "../assets/img/arpa.png",
    link: "./enDesarrollo.html",
    carpetaSonidos: "../assets/sonidos/arpa/"
  },
  {
    id: 13,
    nombre: "Sintetizador",
    tipoSonido: "electronico",
    escala: "ninguna",
    categoria: "teclado",
    imagen: "../assets/img/sintetizador.png",
    link: "./enDesarrollo.html",
    carpetaSonidos: "../assets/sonidos/synth/"
  },
  {
    id: 14,
    nombre: "Maracas",
    tipoSonido: "folk",
    escala: "ninguna",
    categoria: "percusion",
    imagen: "../assets/img/maracas.png",
    link: "./enDesarrollo.html",
    carpetaSonidos: "../assets/sonidos/maracas/"
  },
  {
    id: 15,
    nombre: "Bongos",
    tipoSonido: "latino",
    escala: "ninguna",
    categoria: "percusion",
    imagen: "../assets/img/bongos.png",
    link: "./enDesarrollo.html",
    carpetaSonidos: "../assets/sonidos/bongos/"
  },
  {
    id: 16,
    nombre: "Xilófono",
    tipoSonido: "acustico",
    escala: "ninguna",
    categoria: "percusion",
    imagen: "../assets/img/xilofono.png",
    link: "./enDesarrollo.html",
    carpetaSonidos: "../assets/sonidos/xilofono/"
  },
  {
    id: 17,
    nombre: "Órgano de Iglesia",
    tipoSonido: "clasico",
    escala: "ninguna",
    categoria: "teclado",
    imagen: "../assets/img/organo.png",
    link: "./enDesarrollo.html",
    carpetaSonidos: "../assets/sonidos/organo/"
  },
  {
    id: 18,
    nombre: "Ukelele",
    tipoSonido: "folk",
    escala: "ninguna",
    categoria: "cuerda",
    imagen: "../assets/img/ukelele.png",
    link: "./enDesarrollo.html",
    carpetaSonidos: "../assets/sonidos/ukelele/"
  },
  {
    id: 19,
    nombre: "Batería Electrónica",
    tipoSonido: "electronico",
    escala: "ninguna",
    categoria: "percusion",
    imagen: "../assets/img/bateriaElec.png",
    link: "./enDesarrollo.html",
    carpetaSonidos: "../assets/sonidos/drumkitElec/"
  },
  {
    id: 20,
    nombre: "Cello",
    tipoSonido: "clasico",
    escala: "ninguna",
    categoria: "cuerda",
    imagen: "../assets/img/cello.png",
    link: "./enDesarrollo.html",
    carpetaSonidos: "../assets/sonidos/cello/"
  },
  {
    id: 21,
    nombre: "Banjo",
    tipoSonido: "folk",
    escala: "ninguna",
    categoria: "cuerda",
    imagen: "../assets/img/banjo.png",
    link: "./enDesarrollo.html",
    carpetaSonidos: "../assets/sonidos/banjo/"
  },
  {
    id: 22,
    nombre: "Clarinete",
    tipoSonido: "clasico",
    escala: "ninguna",
    categoria: "viento",
    imagen: "../assets/img/clarinete.png",
    link: "./enDesarrollo.html",
    carpetaSonidos: "../assets/sonidos/clarinete/"
  },
  {
    id: 23,
    nombre: "Harmónica",
    tipoSonido: "blues",
    escala: "ninguna",
    categoria: "viento",
    imagen: "../assets/img/harmonica.png",
    link: "./enDesarrollo.html",
    carpetaSonidos: "../assets/sonidos/harmonica/"
  },
  {
    id: 24,
    nombre: "Theremin",
    tipoSonido: "electronico",
    escala: "ninguna",
    categoria: "electronico",
    imagen: "../assets/img/theremin.png",
    link: "./enDesarrollo.html",
    carpetaSonidos: "../assets/sonidos/theremin/"
  }
];

let nextId = 25;

module.exports = { instrumentos, nextId };