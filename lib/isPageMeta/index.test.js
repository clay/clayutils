'use strict';

const name = __filename.split('/').pop().split('.').shift(),
  fn = require('./' + name),
  expect = require('chai').expect;

describe('isPageMeta', () => {
  it('returns false if no meta', () => {
    expect(fn('domain.com/_pages/foo')).to.equal(false);
  });

  it('returns true if meta', () => {
    expect(fn('domain.com/sitepath/_pages/foobarbaz/meta')).to.equal(true);
  });

  it('throws an error if the URI passed in is not a string', () => {
    const nonStringArgument = function () {
      return fn([0, 1, 2, 3]);
    };

    expect(nonStringArgument).to.throw(Error);
  });

  it('returns false if non-page reference', () => {
    expect(fn('domain.com/_users/foo')).to.equal(false);
    expect(fn('domain.com/_components/foo')).to.equal(false);
    expect(fn('domain.com/_layouts/foo/instances/bar/meta')).to.equal(false);
  });
});
