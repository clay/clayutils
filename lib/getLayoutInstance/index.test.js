'use strict';

const { describe, it } = require('node:test'),
  assert = require('node:assert/strict'),
  fn = require('./index');

describe('getLayoutInstance', () => {
  it('gets instance from uri', function () {
    assert.equal(fn('/_layouts/base/instances/0'), '0');
  });

  it('gets instance from uri with extension', function () {
    assert.equal(fn('/_layouts/base/instances/0.html'), '0');
  });

  it('gets instance from uri with version', function () {
    assert.equal(fn('/_layouts/base/instances/0@published'), '0');
  });

  it('gets instance from full uri', function () {
    assert.equal(fn('domain.com/sitepath/_layouts/base/instances/foobarbaz@published'), 'foobarbaz');
  });

  it('gets instance without meta', function () {
    assert.equal(fn('domain.com/_layouts/foobar/instances/baz/meta'), 'baz');
  });

  it('CANNOT get instance from default uri', function () {
    assert.notEqual(fn('/_layouts/base'), '0');
  });

  it('throws an error if argument passed in is not a String', () => {
    const nonStringArgument = function () {
      return fn([1, 2, 3, 4]);
    };

    assert.throws(nonStringArgument, Error);
  });
});
