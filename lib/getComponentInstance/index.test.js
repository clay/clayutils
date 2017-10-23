'use strict';

const name = __filename.split('/').pop().split('.').shift(),
  fn = require('./' + name),
  expect = require('chai').expect;

describe('getComponentInstance', () => {
  it('gets instance from uri', function () {
    expect(fn('/components/base/instances/0')).to.equal('0');
  });

  it('gets instance from uri with extension', function () {
    expect(fn('/components/base/instances/0.html')).to.equal('0');
  });

  it('gets instance from uri with version', function () {
    expect(fn('/components/base/instances/0@published')).to.equal('0');
  });

  it('gets instance from full uri', function () {
    expect(fn('nymag.com/press/components/base/instances/foobarbaz@published')).to.equal('foobarbaz');
  });

  it('CANNOT get instance from default uri', function () {
    expect(fn('/components/base')).to.not.equal('0');
  });

  it('throws an error if argument passed in is not a String', () => {
    const nonStringArgument = function () {
      return fn([1, 2, 3, 4]);
    };

    expect(nonStringArgument).to.throw(Error);
  });
});
