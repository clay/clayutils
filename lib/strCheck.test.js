'use strict';

const { describe, it } = require('node:test'),
  assert = require('node:assert/strict'),
  { strCheck } = require('./strCheck');

describe('strCheck', () => {
  it('returns true for a string', () => {
    assert.equal(strCheck('/_components/base'), true);
    assert.equal(strCheck(''), true);
  });

  it('throws an Error that names the type for anything else', () => {
    [
      [undefined, 'undefined'],
      [null, 'object'],
      [0, 'number'],
      [NaN, 'number'],
      [true, 'boolean'],
      [{}, 'object'],
      [[], 'object'],
      [new String('/_components/base'), 'object'],
      [() => {}, 'function'],
      [Symbol('s'), 'symbol']
    ].forEach(([arg, type]) => {
      assert.throws(() => strCheck(arg), { name: 'Error', message: `Argument must be a string, not ${type}` });
    });
  });
});
