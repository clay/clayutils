'use strict';

const { describe, it } = require('node:test'),
  assert = require('node:assert/strict'),
  fn = require('./index');

describe('getPageVersion', () => {
  it('gets version from instance uri', () => {
    assert.equal(fn('/_pages/foo@published'), 'published');
  });

  it('returns null if no version', () => {
    assert.equal(fn('/_pages/foo'), null);
  });

  it('throws an error if argument passed in is not a String', () => {
    const nonStringArgument = function () {
      return fn([1, 2, 3, 4]);
    };

    assert.throws(nonStringArgument, Error);
  });
});
