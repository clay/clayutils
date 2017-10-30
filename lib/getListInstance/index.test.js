'use strict';

const name = __filename.split('/').pop().split('.').shift(),
  fn = require('./' + name),
  expect = require('chai').expect;

describe('getListInstance', function () {

  it('gets instance from uri', function () {
    expect(fn('/_lists/foo')).to.equal('foo');
  });

  it('CANNOT get instance from a non-list uri', function () {
    expect(fn('/_components/foo/instances/0')).to.equal(null);
    expect(fn('/_pages/foo')).to.equal(null);
  });

  it('throws an error if argument passed in is not a String', function () {
    const nonStringArgument = function () {
      return fn([1, 2, 3, 4]);
    };

    expect(nonStringArgument).to.throw(Error);
  });
});
