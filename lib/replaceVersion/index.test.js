'use strict';

const { describe, it } = require('node:test'),
  assert = require('node:assert/strict'),
  fn = require('./index');

describe('replaceVersion', () => {
  it('adds version to base', function () {
    assert.equal(fn('domain.com/_pages/foo', 'bar'), 'domain.com/_pages/foo@bar');
  });

  it('replaces version', function () {
    assert.equal(fn('domain.com/_pages/foo@bar', 'baz'), 'domain.com/_pages/foo@baz');
  });

  it('removes version', function () {
    assert.equal(fn('domain.com/_pages/foo@bar'), 'domain.com/_pages/foo');
  });

  it('throws if url is not a string', () => {
    const result = () => fn(1);

    assert.throws(result, { message: 'Argument must be a string, not number' });
  });
});
