'use strict';

const { describe, it } = require('node:test'),
  assert = require('node:assert/strict'),
  fn = require('./index');

describe('isPublished', () => {
  it('returns true if the reference is published', () => {
    assert.equal(fn('domain.com/_components/foo/instances/bar@published'), true);
  });

  it('returns false if the reference is not published', () => {
    assert.equal(fn('domain.com/_components/foo/instances/bar'), false);
  });

  it('throws an error if the URI passed in is not a string', () => {
    const nonStringArgument = function () {
      return fn([0, 1, 2, 3]);
    };

    assert.throws(nonStringArgument, Error);
  });
});
