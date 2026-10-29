'use strict';

const { describe, it } = require('node:test'),
  assert = require('node:assert/strict'),
  fn = require('./index');

describe('isList', () => {
  it('returns true if list reference', () => {
    assert.equal(fn('domain.com/_lists/foo'), true);
  });

  it('throws an error if the URI passed in is not a string', () => {
    const nonStringArgument = function () {
      return fn([0, 1, 2, 3]);
    };

    assert.throws(nonStringArgument, Error);
  });

  it('returns false if non-list reference', () => {
    assert.equal(fn('domain.com/_users/foo'), false);
    assert.equal(fn('domain.com/_pages/foo'), false);
    assert.equal(fn('domain.com/_components/foo'), false);
    assert.equal(fn('domain.com/_components/foo/instances/bar'), false);
  });
});
