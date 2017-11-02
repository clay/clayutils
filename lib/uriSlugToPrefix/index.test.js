'use strict';

const name = __filename.split('/').pop().split('.').shift(),
  fn = require('./' + name),
  expect = require('chai').expect,
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

    expect(fn('domain', otherSite)).to.equal('domain.com/a');
  });

  it('swaps the site prefix for the site slug for lists', () => {
    expect(fn('domain/_lists/foo', site)).to.equal('domain.com/path/_lists/foo');
  });

  it('swaps the site prefix for the site slug for components', () => {
    expect(fn('domain/_components/foo/instances/bar', site)).to.equal('domain.com/path/_components/foo/instances/bar');
  });

  it('swaps the site prefix for the site slug for pages', () => {
    expect(fn('domain/_pages/foo', site)).to.equal('domain.com/path/_pages/foo');
  });

  it('swaps the site prefix for the site slug for uris', () => {
    expect(fn('domain/_uris/foo', site)).to.equal('domain.com/path/_uris/foo');
  });

  it('works with the site prefix too', () => {
    site.prefix = 'domain.com/path';
    expect(fn('domain/_lists/foo', site)).to.equal('domain.com/path/_lists/foo');
    expect(fn('domain/_components/foo/instances/bar', site)).to.equal('domain.com/path/_components/foo/instances/bar');
    expect(fn('domain/_pages/foo', site)).to.equal('domain.com/path/_pages/foo');
    expect(fn('domain/_uris/foo', site)).to.equal('domain.com/path/_uris/foo');
  });

  it('if no path, uses just the host', () => {
    const siteWithNoPath = {
      slug: 'domain',
      host: 'domain.com'
    };

    expect(fn('domain/_lists/foo', siteWithNoPath)).to.equal('domain.com/_lists/foo');
    expect(fn('domain/_components/foo/instances/bar', siteWithNoPath)).to.equal('domain.com/_components/foo/instances/bar');
    expect(fn('domain/_pages/foo', siteWithNoPath)).to.equal('domain.com/_pages/foo');
    expect(fn('domain/_uris/foo', siteWithNoPath)).to.equal('domain.com/_uris/foo');
  });

  it('throws an error if the URI passed in is not a string', () => {
    const nonStringArgument = function () {
      return fn([0, 1, 2, 3]);
    };

    expect(nonStringArgument).to.throw(Error);
  });
});
