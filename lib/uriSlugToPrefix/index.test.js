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

  it('puts the prefix in as it is, even with replacement patterns in it', () => {
    assert.equal(fn('domain/_pages/foo', { slug: 'domain', prefix: 'a$&b' }), 'a$&b/_pages/foo');
    assert.equal(fn('domain/_pages/foo', { slug: 'domain', host: '$1.com', path: '/$$' }), '$1.com/$$/_pages/foo');
  });

  it('looks for the slug as text, with regular expression characters in it', () => {
    assert.equal(fn('a.b+c/_pages/foo', { slug: 'a.b+c', host: 'domain.com' }), 'domain.com/_pages/foo');
    assert.equal(fn('aXb/_pages/foo', { slug: 'a.b', host: 'domain.com' }), 'aXb/_pages/foo');
  });

  it('checks the uri before it reads the site', () => {
    assert.throws(() => fn(5, undefined), { name: 'Error', message: 'Argument must be a string, not number' });
    assert.throws(() => fn(true, null), { name: 'Error', message: 'Argument must be a string, not boolean' });
    assert.throws(() => fn({}, site), { name: 'Error', message: 'Argument must be a string, not object' });
  });
});
