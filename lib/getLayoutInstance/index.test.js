'use strict';

const name = __filename.split('/').pop().split('.').shift(),
  fn = require('./' + name),
  expect = require('chai').expect;

describe('getLayoutInstance', () => {
  it('gets instance from uri', function () {
    const uris = [
      '/_layouts/base/instances/0',
      '/_layouts/base/instances/0/meta'
    ];

    uris.forEach(uri => {
      expect(fn(uri)).to.equal('0');
    });
  });

  it('gets instance from uri with extension', function () {
    expect(fn('/_layouts/base/instances/0.html')).to.equal('0');
  });

  it('gets instance from uri with version', function () {
    expect(fn('/_layouts/base/instances/0@published')).to.equal('0');
  });

  it('gets instance from full uri', function () {
    expect(fn('nymag.com/press/_layouts/base/instances/foobarbaz@published')).to.equal('foobarbaz');
  });

  it('CANNOT get instance from default uri', function () {
    expect(fn('/_layouts/base')).to.not.equal('0');
  });

  it('throws an error if argument passed in is not a String', () => {
    const nonStringArgument = function () {
      return fn([1, 2, 3, 4]);
    };

    expect(nonStringArgument).to.throw(Error);
  });
});
