'use strict';

const name = __filename.split('/').pop().split('.').shift(),
  fn = require('./' + name),
  expect = require('chai').expect;

describe('getPageInstance', () => {
  it('gets instance from uri', function () {
    const uris = [
      '/_pages/foobar',
      '/_pages/foobar/meta'
    ];

    uris.forEach(uri => {
      expect(fn(uri)).to.equal('foobar');
    });
  });

  it('gets instance from uri', function () {
    const uris = [
      '/_pages/foobar-baz',
      '/_pages/foobar-baz/meta'
    ];

    uris.forEach(uri => {
      expect(fn(uri)).to.equal('foobar-baz');
    });
  });

  it('gets instance from uri with version', function () {
    expect(fn('/_pages/foobar@published')).to.equal('foobar');
  });

  it('gets instance from full uri', function () {
    expect(fn('nymag.com/scienceofus/_pages/foobarbaz@published')).to.equal('foobarbaz');
  });

  it('CANNOT get instance from a non-page uri', function () {
    const uris = [
      '/_components/base/instances/0',
      '/_components/base/instances/0/meta'
    ];

    uris.forEach(uri => {
      expect(fn(uri)).to.not.equal('0');
    });
  });

  it('throws an error if argument passed in is not a String', () => {
    const nonStringArgument = function () {
      return fn([1, 2, 3, 4]);
    };

    expect(nonStringArgument).to.throw(Error);
  });
});
