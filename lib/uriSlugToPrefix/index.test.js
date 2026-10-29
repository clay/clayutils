'use strict';

const { describe, it } = require('node:test'),
  assert = require('node:assert/strict'),
  fn = require('./index'),
  site = {
    slug: 'domain',
    host: 'domain.com',
    path: '/path'
  };

describe('uriSlugToPrefix', () => {
  it('swaps the site slug for the site prefix without a trailing slash', () => {
    const otherSite = {
      slug: 'domain',
      host: 'domain.com',
      path: '/a'
    };

    assert.equal(fn('domain', otherSite), 'domain.com/a');
  });

  it('swaps the site prefix for the site slug for lists', () => {
    assert.equal(fn('domain/_lists/foo', site), 'domain.com/path/_lists/foo');
  });

  it('swaps the site prefix for the site slug for components', () => {
    assert.equal(fn('domain/_components/foo/instances/bar', site), 'domain.com/path/_components/foo/instances/bar');
  });

  it('swaps the site prefix for the site slug for pages', () => {
    assert.equal(fn('domain/_pages/foo', site), 'domain.com/path/_pages/foo');
  });

  it('swaps the site prefix for the site slug for uris', () => {
    assert.equal(fn('domain/_uris/foo', site), 'domain.com/path/_uris/foo');
  });

  it('works with the site prefix too', () => {
    site.prefix = 'domain.com/path';
    assert.equal(fn('domain/_lists/foo', site), 'domain.com/path/_lists/foo');
    assert.equal(fn('domain/_components/foo/instances/bar', site), 'domain.com/path/_components/foo/instances/bar');
    assert.equal(fn('domain/_pages/foo', site), 'domain.com/path/_pages/foo');
    assert.equal(fn('domain/_uris/foo', site), 'domain.com/path/_uris/foo');
  });

  it('if no path, uses just the host', () => {
    const siteWithNoPath = {
      slug: 'domain',
      host: 'domain.com'
    };

    assert.equal(fn('domain/_lists/foo', siteWithNoPath), 'domain.com/_lists/foo');
    assert.equal(fn('domain/_components/foo/instances/bar', siteWithNoPath), 'domain.com/_components/foo/instances/bar');
    assert.equal(fn('domain/_pages/foo', siteWithNoPath), 'domain.com/_pages/foo');
    assert.equal(fn('domain/_uris/foo', siteWithNoPath), 'domain.com/_uris/foo');
  });

  it('throws an error if the URI passed in is not a string', () => {
    const nonStringArgument = function () {
      return fn([0, 1, 2, 3]);
    };

    assert.throws(nonStringArgument, Error);
  });
});
