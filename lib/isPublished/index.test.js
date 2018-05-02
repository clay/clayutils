'use strict';

const name = __filename.split('/').pop().split('.').shift(),
  fn = require('./' + name),
  expect = require('chai').expect;

describe('isPublished', () => {
  it('returns true if the reference is published', () => {
    expect(fn('domain.com/_components/foo/instances/bar@published')).to.equal(true);
  });

  it('returns false if the reference is not published', () => {
    expect(fn('domain.com/_components/foo/instances/bar')).to.equal(false);
  });

  it('throws an error if the URI passed in is not a string', () => {
    const nonStringArgument = function () {
      return fn([0, 1, 2, 3]);
    };

    expect(nonStringArgument).to.throw(Error);
  });
});
