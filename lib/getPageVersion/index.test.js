'use strict';

const name = __filename.split('/').pop().split('.').shift(),
  fn = require('./' + name),
  expect = require('chai').expect;

describe('getPageVersion', () => {
  it('gets version from instance uri', () => {
    expect(fn('/pages/foo@published')).to.equal('published');
  });

  it('returns null if no version', () => {
    expect(fn('/pages/foo')).to.equal(null);
  });

  it('throws an error if argument passed in is not a String', () => {
    const nonStringArgument = function () {
      return fn([1, 2, 3, 4]);
    };

    expect(nonStringArgument).to.throw(Error);
  });
});
