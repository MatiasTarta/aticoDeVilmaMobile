const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

const { createApp } = require('./app');

const FIXTURES = [
  { id: 1, nombre: 'Piano Clásico', tipoSonido: 'acustico', escala: 'ninguna', categoria: 'teclado', imagen: '../assets/img/piano.png', link: './individualPiano.html', carpetaSonidos: '../assets/sonidos/piano/' },
  { id: 2, nombre: 'Batería Rock', tipoSonido: 'rock', escala: 'ninguna', categoria: 'percusion', imagen: '../assets/img/bateria.png', link: './individualBateria.html', carpetaSonidos: '../assets/sonidos/drumkit/' },
  { id: 3, nombre: 'Piano Psicodélico', tipoSonido: 'psicodelico', escala: 'ninguna', categoria: 'teclado', imagen: '../assets/img/pianoPsicodelico.png', link: './individualPianoSonidos.html', carpetaSonidos: '../assets/sonidos/pianoPsico/' },
  { id: 4, nombre: 'Guitarra Acústica', tipoSonido: 'acustico', escala: 'ninguna', categoria: 'cuerda', imagen: '../assets/img/guitarra.png', link: './enDesarrollo.html', carpetaSonidos: '../assets/sonidos/guitarra/' },
];

async function conServidor(fn) {
  const app = createApp({ instrumentos: FIXTURES, nextId: 5 });
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  try {
    await fn(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test('la lista por defecto mantiene solo los funcionales', () =>
  conServidor(async (base) => {
    const res = await fetch(`${base}/api/instrumentos?cantidad=50&from=0`);
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.total, 3);
    assert.deepEqual(body.datos.map((i) => i.id), [1, 2, 3]);
  }));

test('la lista con incluirEnDesarrollo=1 devuelve todos', () =>
  conServidor(async (base) => {
    const res = await fetch(`${base}/api/instrumentos?cantidad=50&from=0&incluirEnDesarrollo=1`);
    const body = await res.json();
    assert.equal(body.total, 4);
    assert.ok(body.datos.some((i) => i.id === 4));
  }));

test('el detalle devuelve un instrumento en desarrollo', () =>
  conServidor(async (base) => {
    const res = await fetch(`${base}/api/instrumentos/4`);
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.nombre, 'Guitarra Acústica');
  }));

test('el detalle inexistente devuelve 404', () =>
  conServidor(async (base) => {
    const res = await fetch(`${base}/api/instrumentos/9999`);
    assert.equal(res.status, 404);
  }));

test('el detalle no numérico devuelve 400', () =>
  conServidor(async (base) => {
    const res = await fetch(`${base}/api/instrumentos/abc`);
    assert.equal(res.status, 400);
  }));

test('POST crea y el instrumento se puede pedir por id', () =>
  conServidor(async (base) => {
    const res = await fetch(`${base}/api/instrumentos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'Theremin', tipoSonido: 'electronico', categoria: 'electronico' }),
    });
    const creado = await res.json();
    assert.equal(res.status, 201);
    assert.equal(creado.id, 5);
    assert.equal(creado.escala, 'ninguna');

    const lista = await fetch(`${base}/api/instrumentos?cantidad=50&from=0&incluirEnDesarrollo=1`).then((r) => r.json());
    assert.equal(lista.total, 5);

    const detalle = await fetch(`${base}/api/instrumentos/5`).then((r) => r.json());
    assert.equal(detalle.nombre, 'Theremin');
  }));

test('POST sin nombre devuelve 400 con detalles', () =>
  conServidor(async (base) => {
    const res = await fetch(`${base}/api/instrumentos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipoSonido: 'rock', categoria: 'cuerda' }),
    });
    const body = await res.json();
    assert.equal(res.status, 400);
    assert.ok(body.detalles.some((mensaje) => mensaje.includes("'nombre'")));
  }));

test('PUT recalcula funcional y lo hace visible por defecto', () =>
  conServidor(async (base) => {
    const res = await fetch(`${base}/api/instrumentos/4`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ link: './individualGuitarra.html' }),
    });
    assert.equal(res.status, 200);

    const lista = await fetch(`${base}/api/instrumentos?cantidad=50&from=0`).then((r) => r.json());
    assert.equal(lista.total, 4);
  }));
