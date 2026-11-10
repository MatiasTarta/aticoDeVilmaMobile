const express = require('express');
const cors = require('cors');

const { esFuncional } = require('./funcional');

function createApp({ instrumentos, nextId }) {
  const app = express();

  app.use(cors());
  app.use(express.json()); // parsea el json del body

  // copia local para no mutar los datos originales
  const datos = instrumentos.map((instrumento) => ({
    ...instrumento,
    funcional: esFuncional(instrumento),
  }));
  let idCounter = nextId;

  app.get('/api/instrumentos', (req, res) => {
    // Obtener parámetros de query (?cantidad=5&from=0)
    const cantidad = parseInt(req.query.cantidad) || 10; // Default: 10
    const from = parseInt(req.query.from) || 0;         // Default: 0

    if (cantidad < 1 || from < 0) {
      return res.status(400).json({
        error: 'Parámetros inválidos cantidad debe ser > 0 y from debe ser >= 0',
      });
    }

    const visibles = req.query.incluirEnDesarrollo === '1'
      ? datos
      : datos.filter((instrumento) => instrumento.funcional);

    const resultado = visibles.slice(from, from + cantidad);

    res.json({
      total: visibles.length,
      cantidad: resultado.length,
      from: from,
      datos: resultado,
    });
  });

  app.get('/api/instrumentos/:id', (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: 'ID inválido, debe ser un número',
      });
    }

    // cualquier instrumento existente tiene ficha, sea funcional o no
    const instrumento = datos.find((inst) => inst.id === id);

    if (!instrumento) {
      return res.status(404).json({
        error: 'Instrumento no encontrado',
      });
    }

    res.json(instrumento);
  });

  // POST - Crear nuevo instrumento
  app.post('/api/instrumentos', (req, res) => {
    const { nombre, tipoSonido, escala, categoria, imagen, link, carpetaSonidos } = req.body;

    // VALIDACIONES
    const errores = [];

    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
      errores.push("El campo 'nombre' es obligatorio y debe ser texto no vacío");
    }

    if (!tipoSonido || typeof tipoSonido !== 'string' || tipoSonido.trim() === '') {
      errores.push("El campo 'tipoSonido' es obligatorio y debe ser texto no vacío");
    }

    if (!categoria || typeof categoria !== 'string' || categoria.trim() === '') {
      errores.push("El campo 'categoria' es obligatorio y debe ser texto no vacío");
    }

    const categoriasValidas = ['teclado', 'percusion', 'cuerda', 'viento', 'electronico'];
    if (categoria && !categoriasValidas.includes(categoria.toLowerCase())) {
      errores.push(`El campo 'categoria' debe ser uno de: ${categoriasValidas.join(', ')}`);
    }

    // datos opcionales
    if (escala !== undefined && typeof escala !== 'string') {
      errores.push("El campo 'escala' debe ser texto");
    }

    if (imagen !== undefined && typeof imagen !== 'string') {
      errores.push("El campo 'imagen' debe ser texto");
    }

    if (link !== undefined && typeof link !== 'string') {
      errores.push("El campo 'link' debe ser texto");
    }

    if (carpetaSonidos !== undefined && typeof carpetaSonidos !== 'string') {
      errores.push("El campo 'carpetaSonidos' debe ser texto");
    }

    if (errores.length > 0) {
      return res.status(400).json({
        error: 'Datos inválidos',
        detalles: errores,
      });
    }

    // creo nuevo instrumento
    const linkFinal = link || '';
    const nuevoInstrumento = {
      id: idCounter++,
      nombre: nombre.trim(),
      tipoSonido: tipoSonido.trim(),
      escala: escala || 'ninguna',
      categoria: categoria.trim(),
      imagen: imagen || '../assets/img/placeholder.png',
      link: linkFinal,
      carpetaSonidos: carpetaSonidos || '',
      funcional: esFuncional({ link: linkFinal }),
    };

    datos.push(nuevoInstrumento);

    res.status(201).json(nuevoInstrumento);
  });

  // PUT - Actualizar instrumento existente
  app.put('/api/instrumentos/:id', (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: 'ID inválido',
      });
    }

    const index = datos.findIndex((inst) => inst.id === id);

    if (index === -1) {
      return res.status(404).json({
        error: 'Instrumento no encontrado',
      });
    }

    // Datos a actualizar
    const { nombre, tipoSonido, escala, categoria, link } = req.body;

    // VALIDACIONES
    const errores = [];

    if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim() === '')) {
      errores.push("El campo 'nombre' debe ser texto no vacío");
    }

    if (tipoSonido !== undefined && typeof tipoSonido !== 'string') {
      errores.push("El campo 'tipoSonido' debe ser texto");
    }

    if (categoria !== undefined && typeof categoria !== 'string') {
      errores.push("El campo 'categoria' debe ser texto");
    }

    if (escala !== undefined && typeof escala !== 'string') {
      errores.push("El campo 'escala' debe ser texto");
    }

    if (link !== undefined && typeof link !== 'string') {
      errores.push("El campo 'link' debe ser texto");
    }

    if (errores.length > 0) {
      return res.status(400).json({
        error: 'Datos inválidos',
        detalles: errores,
      });
    }

    // Actualizar solo los campos presentes
    if (nombre !== undefined) datos[index].nombre = nombre.trim();
    if (tipoSonido !== undefined) datos[index].tipoSonido = tipoSonido;
    if (escala !== undefined) datos[index].escala = escala;
    if (categoria !== undefined) datos[index].categoria = categoria;
    if (link !== undefined) datos[index].link = link;

    datos[index].funcional = esFuncional(datos[index]);

    // Devolver instrumento actualizado
    res.json(datos[index]);
  });

  return app;
}

module.exports = { createApp };
