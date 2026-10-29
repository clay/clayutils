'use strict';

const { describe, it } = require('node:test'),
  assert = require('node:assert/strict'),
  fn = require('./index');

describe('isPageMeta', () => {
  it('returns false if no meta', () => {
    assert.equal(fn('domain.com/_pages/foo'), false);
  });

  it('returns true if meta', () => {
    assert.equal(fn('domain.com/sitepath/_pages/foobarbaz/meta'), true);
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
    assert.equal(fn('domain.com/_layouts/foo/instances/bar/meta'), false);
  });
});
