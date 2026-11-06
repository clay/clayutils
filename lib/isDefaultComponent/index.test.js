'use strict';

const { describe, it } = require('node:test'),
  assert = require('node:assert/strict'),
  fn = require('./index');

describe('isDefaultComponent', () => {
  it('returns true if default component reference', () => {
    assert.equal(fn('domain.com/_components/foo'), true);
  });

  it('returns false if component instance reference', () => {
    assert.equal(fn('domain.com/_components/foo/instances/bar'), false);
  });

  it('throws an error if argument passed in is not a String', () => {
    const nonStringArgument = function () {
      return fn([1, 2, 3, 4]);
    };

    assert.throws(nonStringArgument, Error);
  });

  it('returns false if non-component reference', () => {
    assert.equal(fn('domain.com/_users/foo'), false);
    assert.equal(fn('domain.com/_pages/foo'), false);
  });
});
