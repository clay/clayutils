'use strict';

const name = __filename.split('/').pop().split('.').shift(),
  fn = require('./' + name),
  expect = require('chai').expect;

describe('isDefaultComponent', () => {
  it('returns true if default component reference', () => {
    expect(fn('domain.com/components/foo')).to.equal(true);
  });

  it('returns false if component instance reference', () => {
    expect(fn('domain.com/components/foo/instances/bar')).to.equal(false);
  });

  it('throws an error if argument passed in is not a String', () => {
    const nonStringArgument = function () {
      return fn([1, 2, 3, 4]);
    };

    expect(nonStringArgument).to.throw(Error);
  });

  it('returns false if non-component reference', () => {
    expect(fn('domain.com/users/foo')).to.equal(false);
    expect(fn('domain.com/pages/foo')).to.equal(false);
  });
});
