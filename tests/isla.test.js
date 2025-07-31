import assert from 'node:assert/strict';
import { test } from 'node:test';
import { GameData } from '../src/data.js';

test('GameData incluye isla ax²+bx+c', () => {
  const data = new GameData();
  const isla = data.islas.find(i => i.nombre.includes('ax²+bx+c'));
  assert.ok(isla, 'Debe existir la isla ax²+bx+c');
  assert.equal(isla.enemigos.length, 6);
  assert.equal(isla.monstruo.color, '#e53935');
});

test('mapNodos contiene estaciones y cartel final para la nueva isla', () => {
  const data = new GameData();
  const nodos = data.mapNodos.filter(n => n.isla === 1);
  const estaciones = nodos.filter(n => n.tipo === 'minion' || n.tipo === 'monstruo');
  assert.equal(estaciones.length, 7, 'Deben existir 6 minions y un jefe');
  const cartel = nodos.find(n => n.tipo === 'fin');
  assert.ok(cartel, 'Debe existir un cartel de felicitaciones');
});
