'use strict';

const name = __filename.split('/').pop().split('.').shift(),
  fn = require('./' + name),
  expect = require('chai').expect;

describe('isLayout', () => {
  it('returns true if layout reference', () => {
    expect(fn('domain.com/_layouts/foo')).to.equal(true);
  });

  it('returns true if layout instance reference', () => {
    expect(fn('domain.com/_layouts/foo/instances/bar')).to.equal(true);
  });

  it('throws an error if the URI passed in is not a string', () => {
    const nonStringArgument = function () {
      return fn([0, 1, 2, 3]);
    };

    expect(nonStringArgument).to.throw(Error);
  });

  it('returns false if non-layout reference', () => {
    expect(fn('domain.com/_users/foo')).to.equal(false);
    expect(fn('domain.com/_pages/foo')).to.equal(false);
  });
});
