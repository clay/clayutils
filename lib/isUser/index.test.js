'use strict';

const { describe, it } = require('node:test'),
  assert = require('node:assert/strict'),
  fn = require('./index');

describe('isUser', () => {
  it('returns true if user reference', () => {
    assert.equal(fn('domain.com/_users/foo'), true);
  });

  it('throws an error if the URI passed in is not a string', () => {
    const nonStringArgument = function () {
      return fn([0, 1, 2, 3]);
    };

    assert.throws(nonStringArgument, Error);
  });

  it('returns false if non-user reference', () => {
    assert.equal(fn('domain.com/_lists/foo'), false);
    assert.equal(fn('domain.com/_pages/foo'), false);
    assert.equal(fn('domain.com/_components/foo'), false);
    assert.equal(fn('domain.com/_components/foo/instances/bar'), false);
  });
});
