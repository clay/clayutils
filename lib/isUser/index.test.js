'use strict';

const name = __filename.split('/').pop().split('.').shift(),
  fn = require('./' + name),
  expect = require('chai').expect;

describe('isUser', () => {
  it('returns true if user reference', () => {
    expect(fn('domain.com/users/foo')).to.equal(true);
  });

  it('throws an error if the URI passed in is not a string', () => {
    const nonStringArgument = function () {
      return fn([0, 1, 2, 3]);
    };

    expect(nonStringArgument).to.throw(Error);
  });

  it('returns false if non-user reference', () => {
    expect(fn('domain.com/lists/foo')).to.equal(false);
    expect(fn('domain.com/pages/foo')).to.equal(false);
    expect(fn('domain.com/components/foo')).to.equal(false);
    expect(fn('domain.com/components/foo/instances/bar')).to.equal(false);
  });
});
