import assert from 'node:assert/strict';
import { test } from 'node:test';
import { GameData } from '../src/data.js';

test('GameData tiene una sola isla', () => {
  const data = new GameData();
  assert.equal(data.islas.length, 1);
});

test('Factorilandia incluye enemigo cuadrático', () => {
  const data = new GameData();
  const isla = data.islas[0];
  const enemigo = isla.enemigos.find(e => e.nombre.includes('cuadrático'));
  assert.ok(enemigo, 'Debe existir enemigo cuadrático en Factorilandia');
  assert.equal(isla.enemigos.length, 7);
});

test('mapNodos no contiene otras islas', () => {
  const data = new GameData();
  const nodos = data.mapNodos.filter(n => n.isla === 1);
  assert.equal(nodos.length, 0);
});
