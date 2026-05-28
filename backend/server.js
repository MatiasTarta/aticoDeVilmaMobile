const express = require('express');
const app = express();

app.use(express.json()); // parsea el json del body

app.use(express.static('public')); // sirve los archivos estáticos vistas, css, js

//me traigo los datos de la ddbbn't
const dbnt = require('./DDBBnt/instrumentos.js');
const instrumentos = dbnt.instrumentos;
let idCounter = dbnt.nextId;

// === API ===
// GET con paginación
app.get('/api/instrumentos', (req, res) => {
  console.log(`empezando GET paginado de ${req.query.cantidad} desde ${req.query.from}`);
  // Obtener parámetros de query (?cantidad=5&from=0)
  const cantidad = parseInt(req.query.cantidad) || 10; // Default: 10 
  const from = parseInt(req.query.from) || 0;         // Default: 0

  if (cantidad < 1 || from < 0) {
    console.log(`GET paginado finalizado con errorers`);
    return res.status(400).json({ 
      error: "Parámetros inválidos cantidad debe ser > 0 y from debe ser >= 0"
    });    
  }

  // slice sobre el array exportado (slice no modifica, solo devuelve una parte del array)
  const resultado = instrumentos.slice(from, from + cantidad);
  
  res.json({
    total: instrumentos.length,
    cantidad: resultado.length,
    from: from,
    datos: resultado
  });  
});

// GET por ID
app.get('/api/instrumentos/:id', (req, res) => {
  console.log(`empezando GET para id: ${req.params.id} `);
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    console.log(`GET por id finalizado con error`);
    return res.status(400).json({ 
      error: "ID inválido, debe ser un número"
    });
  }

  // busco instrumento
  const instrumento = instrumentos.find(inst => inst.id === id);

  // Si no existe -> 404
  if (!instrumento) {
    console.log(`GET por id finalizado con errores`);
    return res.status(404).json({ 
      error: "Instrumento no encontrado"
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
      error: "Datos inválidos",
      detalles: errores
    });
  }

  // creo nuevo instrumento
  const nuevoInstrumento = {
    id: idCounter++,
    nombre: nombre.trim(),
    tipoSonido: tipoSonido.trim(),
    escala: escala || 'ninguna',
    categoria: categoria.trim(),
    imagen: imagen || '../assets/img/placeholder.png',
    link: link || './enDesarrollo.html',
    carpetaSonidos: carpetaSonidos || ''
  };

  // guardo en la ddbbn't
  instrumentos.push(nuevoInstrumento);

  console.log(`${nuevoInstrumento.nombre} creado exitosamente (ID: ${nuevoInstrumento.id})`);

  res.status(201).json(nuevoInstrumento);
});

// PUT - Actualizar instrumento existente
app.put('/api/instrumentos/:id', (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ 
      error: "ID inválido" 
    });
  }

  const index = instrumentos.findIndex(inst => inst.id === id);

  if (index === -1) {
    return res.status(404).json({ 
      error: "Instrumento no encontrado" 
    });
  }

  // Datos a actualizar
  const { nombre, tipoSonido, escala, categoria } = req.body;

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

  if (errores.length > 0) {
    return res.status(400).json({
      error: "Datos inválidos",
      detalles: errores
    });
  }

  // Actualizar solo los campos presentes
  if (nombre !== undefined) instrumentos[index].nombre = nombre.trim();
  if (tipoSonido !== undefined) instrumentos[index].tipoSonido = tipoSonido;
  if (escala !== undefined) instrumentos[index].escala = escala;
  if (categoria !== undefined) instrumentos[index].categoria = categoria;

  // Devolver instrumento actualizado
  res.json(instrumentos[index]);
});
// === API ===

// inicia servidor
app.listen(3000, () => {
  console.log(`Servidor corriendo en http://localhost:3000`);
});