'use strict';

const { describe, it } = require('node:test'),
  assert = require('node:assert/strict'),
  fn = require('./index');

describe('isLayout', () => {
  it('returns true if layout reference', () => {
    assert.equal(fn('domain.com/_layouts/foo'), true);
  });

  it('returns true if layout instance reference', () => {
    assert.equal(fn('domain.com/_layouts/foo/instances/bar'), true);
  });

  it('throws an error if the URI passed in is not a string', () => {
    const nonStringArgument = function () {
      return fn([0, 1, 2, 3]);
    };

    assert.throws(nonStringArgument, Error);
  });

  it('returns false if non-layout reference', () => {
    assert.equal(fn('domain.com/_users/foo'), false);
    assert.equal(fn('domain.com/_pages/foo'), false);
  });
});
