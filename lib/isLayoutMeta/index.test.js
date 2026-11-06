'use strict';

const { describe, it } = require('node:test'),
  assert = require('node:assert/strict'),
  fn = require('./index');

describe('isLayoutMeta', () => {
  it('returns false if default', () => {
    assert.equal(fn('domain.com/_layouts/foo/meta'), false);
  });

  it('returns false if no meta', () => {
    assert.equal(fn('domain.com/_layouts/foo/instances/bar'), false);
  });

  it('returns true if meta', () => {
    assert.equal(fn('domain.com/sitepath/_layouts/foo/instances/bar/meta'), true);
  });

  it('throws an error if the URI passed in is not a string', () => {
    const nonStringArgument = function () {
      return fn([0, 1, 2, 3]);
    };

    assert.throws(nonStringArgument, Error);
  });

  it('returns false if non-layout reference', () => {
    assert.equal(fn('domain.com/_users/foo'), false);
    assert.equal(fn('domain.com/_components/foo'), false);
    assert.equal(fn('domain.com/_pages/foo/meta'), false);
  });
});
