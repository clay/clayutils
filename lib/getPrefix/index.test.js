'use strict';

const { describe, it } = require('node:test'),
  assert = require('node:assert/strict'),
  fn = require('./index');

describe('getPrefix', () => {
  it('returns site prefix of component uri', () => {
    assert.equal(fn('domain.com/_components/foo'), 'domain.com');
  });
  it('returns site prefix of list uri', () => {
    assert.equal(fn('domain.com/_lists/foo'), 'domain.com');
  });
  it('returns site prefix of uri uri', () => {
    assert.equal(fn('domain.com/_uris/foo'), 'domain.com');
  });
  it('returns site prefix of schedule uri', () => {
    assert.equal(fn('domain.com/_schedule/foo'), 'domain.com');
  });
  it('returns site prefix of user uri', () => {
    assert.equal(fn('domain.com/_users/foo'), 'domain.com');
  });
  it('returns site prefix of page uri', () => {
    assert.equal(fn('domain.com/_pages/foo'), 'domain.com');
  });
  it('returns site prefix of layout uri', () => {
    assert.equal(fn('domain.com/_layouts/foo'), 'domain.com');
  });
  it('returns site prefix of sites uri', () => {
    assert.equal(fn('domain.com/_sites/foo'), 'domain.com');
  });
  it('works with site with path', () => {
    assert.equal(fn('domain.com/a/b/_pages/foo'), 'domain.com/a/b');
  });
  it('throws an error if the URI passed in is not a string', () => {
    assert.throws(() => fn([0, 1, 2, 3]), Error);
  });
});
