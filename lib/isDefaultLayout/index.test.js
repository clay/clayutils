'use strict';

const name = __filename.split('/').pop().split('.').shift(),
  fn = require('./' + name),
  expect = require('chai').expect;

describe('isDefaultLayout', () => {
  it('returns true if default layout reference', () => {
    expect(fn('domain.com/_layouts/foo')).to.equal(true);
  });

  it('returns false if layout instance reference', () => {
    expect(fn('domain.com/_layouts/foo/instances/bar')).to.equal(false);
  });

  it('throws an error if argument passed in is not a String', () => {
    const nonStringArgument = function () {
      return fn([1, 2, 3, 4]);
    };

    expect(nonStringArgument).to.throw(Error);
  });

  it('returns false if non-layout reference', () => {
    expect(fn('domain.com/_users/foo')).to.equal(false);
    expect(fn('domain.com/_pages/foo')).to.equal(false);
    expect(fn('domain.com/_components/foo')).to.equal(false);
  });
});
