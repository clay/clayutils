'use strict';

const name = __filename.split('/').pop().split('.').shift(),
  fn = require('./' + name),
  expect = require('chai').expect;

describe('isUri', () => {
  it('returns true if uri reference', () => {
    expect(fn('domain.com/_uris/foo')).to.equal(true);
  });

  it('returns true if uri instance reference', () => {
    expect(fn('nymag.com/scienceofus/_uris/foobarbaz@published')).to.equal(true);
  });

  it('throws an error if the URI passed in is not a string', () => {
    const nonStringArgument = function () {
      return fn([0, 1, 2, 3]);
    };

    expect(nonStringArgument).to.throw(Error);
  });

  it('returns false if non-uri reference', () => {
    expect(fn('domain.com/_users/foo')).to.equal(false);
    expect(fn('domain.com/_components/foo')).to.equal(false);
  });
});
