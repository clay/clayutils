'use strict';

const { describe, it } = require('node:test'),
  assert = require('node:assert/strict'),
  fn = require('./index');

describe('getPageInstance', () => {
  it('gets instance from uri', function () {
    assert.equal(fn('/_pages/foobar'), 'foobar');
  });

  it('gets instance from uri with version', function () {
    assert.equal(fn('/_pages/foobar@published'), 'foobar@published');
  });

  it('gets instance from full uri', function () {
    assert.equal(fn('domain.com/sitepath/_pages/foobarbaz@published'), 'foobarbaz@published');
  });

  it('gets instance from uri with meta', function () {
    assert.equal(fn('domain.com/_pages/foobar/meta'), 'foobar');
  });

  it('CANNOT get instance from a non-page uri', function () {
    assert.notEqual(fn('/_components/base/instances/0'), '0');
  });

  it('throws an error if argument passed in is not a String', () => {
    const nonStringArgument = function () {
      return fn([1, 2, 3, 4]);
    };

    assert.throws(nonStringArgument, Error);
  });
});
