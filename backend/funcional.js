function esFuncional(instrumento) {
  return instrumento?.link !== './enDesarrollo.html';
}

module.exports = { esFuncional };
