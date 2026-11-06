'use strict';

const { describe, it } = require('node:test'),
  assert = require('node:assert/strict'),
  fn = require('./index');

describe('getListInstance', function () {

  it('gets instance from uri', function () {
    assert.equal(fn('/_lists/foo'), 'foo');
  });

  it('CANNOT get instance from a non-list uri', function () {
    assert.equal(fn('/_components/foo/instances/0'), null);
    assert.equal(fn('/_pages/foo'), null);
  });

  it('throws an error if argument passed in is not a String', function () {
    const nonStringArgument = function () {
      return fn([1, 2, 3, 4]);
    };

    assert.throws(nonStringArgument, Error);
  });
});
