'use strict';

const { describe, it } = require('node:test'),
  assert = require('node:assert/strict'),
  fn = require('./index'),
  site = {
    slug: 'domain',
    host: 'domain.com',
    path: '/'
  };

describe('uriPrefixToSlug', () => {
  it('swaps the site prefix for the site slug without a trailing slash', () => {
    const otherSite = {
      slug: 'domain',
      host: 'domain.com',
      path: '/a'
    };

    assert.equal(fn('domain.com/a', otherSite), 'domain');
  });

  it('swaps the site prefix for the site slug for lists', () => {
    assert.equal(fn('domain.com/_lists/foo', site), 'domain/_lists/foo');
  });

  it('swaps the site prefix for the site slug for components', () => {
    assert.equal(fn('domain.com/_components/foo/instances/bar', site), 'domain/_components/foo/instances/bar');
  });

  it('swaps the site prefix for the site slug for pages', () => {
    assert.equal(fn('domain.com/_pages/foo', site), 'domain/_pages/foo');
  });

  it('swaps the site prefix for the site slug for uris', () => {
    assert.equal(fn('domain.com/_uris/foo', site), 'domain/_uris/foo');
  });

  it('works with the site prefix too', () => {
    const newSite = JSON.parse(JSON.stringify(site)); // quick clone

    newSite.prefix = 'domain.com/path';
    assert.equal(fn('domain.com/path/_lists/foo', newSite), 'domain/_lists/foo');
    assert.equal(fn('domain.com/path/_components/foo/instances/bar', newSite), 'domain/_components/foo/instances/bar');
    assert.equal(fn('domain.com/path/_pages/foo', newSite), 'domain/_pages/foo');
    assert.equal(fn('domain.com/path/_uris/foo', newSite), 'domain/_uris/foo');
  });

  it('works with the site path too', () => {
    const newSite = JSON.parse(JSON.stringify(site)); // quick clone

    newSite.path = '/path';
    assert.equal(fn('domain.com/path/_lists/foo', newSite), 'domain/_lists/foo');
    assert.equal(fn('domain.com/path/_components/foo/instances/bar', newSite), 'domain/_components/foo/instances/bar');
    assert.equal(fn('domain.com/path/_pages/foo', newSite), 'domain/_pages/foo');
    assert.equal(fn('domain.com/path/_uris/foo', newSite), 'domain/_uris/foo');
  });

  it('throws an error if the URI passed in is not a string', () => {
    const nonStringArgument = function () {
      return fn([0, 1, 2, 3]);
    };

    assert.throws(nonStringArgument, Error);
  });
});
