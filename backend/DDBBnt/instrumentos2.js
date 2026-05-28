let instrumentos = [
  {
    id: 1,
    nombre: "Piano",
    tipoSonido: "acustico",
    volumen: 75,
    categoria: "teclado",
    imagen: "../assets/img/piano.png",
    link: "./individualPiano.html",
    carpetaSonidos: "../sounds/piano/"
  },
  {
    id: 2,
    nombre: "Batería",
    tipoSonido: "rock",
    volumen: 80,
    categoria: "percusion",
    imagen: "../assets/img/bateria.png",
    link: "./individualBateria.html",
    carpetaSonidos: "../sounds/bateria/"
  },
  {
    id: 3,
    nombre: "Piano Psicodélico",
    tipoSonido: "electronico",
    volumen: 90,
    categoria: "teclado",
    imagen: "../assets/img/pianoPsicodelico.png",
    link: "./individualPianoSonidos.html",
    carpetaSonidos: "../sounds/pianoPsico/"
  }
];

let nextId = 4; // Para generar IDs automáticos

module.exports = { instrumentos, nextId };