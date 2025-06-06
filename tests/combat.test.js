import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CombatSystem } from '../src/combat.js';

// Stub minimal DOM for constructor
global.document = {
  getElementById: () => ({ style: {}, innerHTML: '' })
};

const cs = new CombatSystem({}, {}, {});

test('direct equality', () => {
  assert.ok(cs.respuestasEquivalentes('x^2+3x+2', 'x^2+3x+2'));
});

test('ignore spaces and plus signs', () => {
  assert.ok(cs.respuestasEquivalentes('x^2 + 3x + 2', 'x^2+3x+2'));
  assert.ok(cs.respuestasEquivalentes('x^2+3x+2', 'x^2 3x 2'));
});

test('commutative factor pairs', () => {
  assert.ok(cs.respuestasEquivalentes('(x+a)(x-b)', '(x-b)(x+a)'));
  assert.ok(!cs.respuestasEquivalentes('(x+a)(x-b)', '(x+a)(x+b)'));
});
