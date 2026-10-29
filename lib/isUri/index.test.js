'use strict';

const { describe, it } = require('node:test'),
  assert = require('node:assert/strict'),
  fn = require('./index');

describe('isUri', () => {
  it('returns true if uri reference', () => {
    assert.equal(fn('domain.com/_uris/foo'), true);
  });

  it('returns true if uri instance reference', () => {
    assert.equal(fn('nymag.com/scienceofus/_uris/foobarbaz@published'), true);
  });

  it('throws an error if the URI passed in is not a string', () => {
    const nonStringArgument = function () {
      return fn([0, 1, 2, 3]);
    };

    assert.throws(nonStringArgument, Error);
  });

  it('returns false if non-uri reference', () => {
    assert.equal(fn('domain.com/_users/foo'), false);
    assert.equal(fn('domain.com/_components/foo'), false);
  });
});
