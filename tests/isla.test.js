import assert from 'node:assert/strict';
import { test } from 'node:test';
import { GameData } from '../src/data.js';

test('GameData incluye isla ax²+bx+c', () => {
  const data = new GameData();
  const isla = data.islas.find(i => i.nombre.includes('ax²+bx+c'));
  assert.ok(isla, 'Debe existir la isla ax²+bx+c');
  assert.equal(isla.enemigos.length, 3);
});

test('GameData incluye isla Factorilandia con 6 enemigos', () => {
  const data = new GameData();
  const isla = data.islas.find(i => i.nombre === 'Factorilandia');
  assert.ok(isla, 'Debe existir la isla Factorilandia');
  assert.equal(isla.enemigos.length, 6);
});

test('mapNodos contiene nodos para la nueva isla', () => {
  const data = new GameData();
  const nodos = data.mapNodos.filter(n => n.isla === 1);
  assert.ok(nodos.length > 0, 'Deben existir nodos para la isla 1');
});
