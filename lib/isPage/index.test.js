'use strict';

const { describe, it } = require('node:test'),
  assert = require('node:assert/strict'),
  fn = require('./index');

describe('isPage', () => {
  it('returns true if page reference', () => {
    assert.equal(fn('domain.com/_pages/foo'), true);
  });

  it('returns true if page instance reference', () => {
    assert.equal(fn('nymag.com/scienceofus/_pages/foobarbaz@published'), true);
  });

  it('throws an error if the URI passed in is not a string', () => {
    const nonStringArgument = function () {
      return fn([0, 1, 2, 3]);
    };

    assert.throws(nonStringArgument, Error);
  });

  it('returns false if non-page reference', () => {
    assert.equal(fn('domain.com/_users/foo'), false);
    assert.equal(fn('domain.com/_components/foo'), false);
  });
});
