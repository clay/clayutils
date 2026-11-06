'use strict';

const { describe, it } = require('node:test'),
  assert = require('node:assert/strict'),
  fn = require('./index');

describe('getLayoutName', () => {
  it('gets name from default uri', function () {
    assert.equal(fn('/_layouts/base'), 'base');
  });

  it('gets name from instance uri', function () {
    assert.equal(fn('/_layouts/base/instances/0'), 'base');
  });

  it('gets name from versioned uri', function () {
    assert.equal(fn('/_layouts/base/instances/0@published'), 'base');
  });

  it('gets name from uri with extension', function () {
    assert.equal(fn('/_layouts/base.html'), 'base');
    assert.equal(fn('/_layouts/base.json'), 'base');
  });

  it('gets name from full uri', function () {
    assert.equal(fn('nymag.com/press/_layouts/base/instances/foobarbaz@published'), 'base');
  });

  it('throws an error if argument passed in is not a String', () => {
    const nonStringArgument = function () {
      return fn([1, 2, 3, 4]);
    };

    assert.throws(nonStringArgument, Error);
  });
});
