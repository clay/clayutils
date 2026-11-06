'use strict';

const { describe, it } = require('node:test'),
  assert = require('node:assert/strict'),
  fn = require('./index');

describe('getComponentVersion', () => {
  it('gets version from instance uri', () => {
    assert.equal(fn('/_components/foo/instances/bar@published'), 'published');
  });

  it('gets version from default uri', () => {
    assert.equal(fn('/_components/base@published'), 'published');
  });

  it('returns null if no version', () => {
    assert.equal(fn('/_components/foo/instances/bar'), null);
    assert.equal(fn('/_components/base'), null);
  });

  it('throws an error if argument passed in is not a String', () => {
    const nonStringArgument = function () {
      return fn([1, 2, 3, 4]);
    };

    assert.throws(nonStringArgument, Error);
  });
});
