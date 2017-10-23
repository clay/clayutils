'use strict';

const name = __filename.split('/').pop().split('.').shift(),
  fn = require('./' + name),
  expect = require('chai').expect;

describe('getPageInstance', () => {
  it('gets instance from uri', function () {
    expect(fn('/pages/foobar')).to.equal('foobar');
  });

  it('gets instance from uri with version', function () {
    expect(fn('/pages/foobar@published')).to.equal('foobar@published');
  });

  it('gets instance from full uri', function () {
    expect(fn('nymag.com/scienceofus/pages/foobarbaz@published')).to.equal('foobarbaz@published');
  });

  it('CANNOT get instance from a non-page uri', function () {
    expect(fn('/components/base/instances/0')).to.not.equal('0');
  });

  it('throws an error if argument passed in is not a String', () => {
    const nonStringArgument = function () {
      return fn([1, 2, 3, 4]);
    };

    expect(nonStringArgument).to.throw(Error);
  });
});
