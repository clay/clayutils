'use strict';

const name = __filename.split('/').pop().split('.').shift(),
  fn = require('./' + name),
  expect = require('chai').expect;

describe('getPrefix', () => {
  it('returns site prefix of component uri', () => {
    expect(fn('domain.com/_components/foo')).to.equal('domain.com');
  });
  it('returns site prefix of list uri', () => {
    expect(fn('domain.com/_lists/foo')).to.equal('domain.com');
  });
  it('returns site prefix of uri uri', () => {
    expect(fn('domain.com/_uris/foo')).to.equal('domain.com');
  });
  it('returns site prefix of schedule uri', () => {
    expect(fn('domain.com/_schedule/foo')).to.equal('domain.com');
  });
  it('returns site prefix of user uri', () => {
    expect(fn('domain.com/_users/foo')).to.equal('domain.com');
  });
  it('returns site prefix of page uri', () => {
    expect(fn('domain.com/_pages/foo')).to.equal('domain.com');
  });
  it('returns site prefix of layout uri', () => {
    expect(fn('domain.com/_layouts/foo')).to.equal('domain.com');
  });
  it('works with site with path', () => {
    expect(fn('domain.com/a/b/_pages/foo')).to.equal('domain.com/a/b');
  });
  it('throws an error if the URI passed in is not a string', () => {
    expect(() => fn([0, 1, 2, 3])).to.throw(Error);
  });
});
