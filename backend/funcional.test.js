const test = require('node:test');
const assert = require('node:assert/strict');
const { esFuncional } = require('./funcional');

test('un instrumento en desarrollo no es funcional', () => {
  assert.equal(esFuncional({ link: './enDesarrollo.html' }), false);
});

test('un instrumento con su propia página es funcional', () => {
  assert.equal(esFuncional({ link: './individualPiano.html' }), true);
});

test('un instrumento sin link es funcional', () => {
  assert.equal(esFuncional({ link: '' }), true);
});
