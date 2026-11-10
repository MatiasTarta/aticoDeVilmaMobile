const dbnt = require('./DDBBnt/instrumentos.js');
const { createApp } = require('./app');

const app = createApp({
  instrumentos: dbnt.instrumentos,
  nextId: dbnt.nextId,
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
