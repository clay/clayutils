'use strict';

const name = __filename.split('/').pop().split('.').shift(),
  fn = require('./' + name),
  expect = require('chai').expect,
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

    expect(fn('domain.com/a', otherSite)).to.equal('domain');
  });

  it('swaps the site prefix for the site slug for lists', () => {
    expect(fn('domain.com/_lists/foo', site)).to.equal('domain/_lists/foo');
  });

  it('swaps the site prefix for the site slug for components', () => {
    expect(fn('domain.com/_components/foo/instances/bar', site)).to.equal('domain/_components/foo/instances/bar');
  });

  it('swaps the site prefix for the site slug for pages', () => {
    expect(fn('domain.com/_pages/foo', site)).to.equal('domain/_pages/foo');
  });

  it('swaps the site prefix for the site slug for uris', () => {
    expect(fn('domain.com/_uris/foo', site)).to.equal('domain/_uris/foo');
  });

  it('works with the site prefix too', () => {
    const newSite = JSON.parse(JSON.stringify(site)); // quick clone

    newSite.prefix = 'domain.com/path';
    expect(fn('domain.com/path/_lists/foo', newSite)).to.equal('domain/_lists/foo');
    expect(fn('domain.com/path/_components/foo/instances/bar', newSite)).to.equal('domain/_components/foo/instances/bar');
    expect(fn('domain.com/path/_pages/foo', newSite)).to.equal('domain/_pages/foo');
    expect(fn('domain.com/path/_uris/foo', newSite)).to.equal('domain/_uris/foo');
  });

  it('works with the site path too', () => {
    const newSite = JSON.parse(JSON.stringify(site)); // quick clone

    newSite.path = '/path';
    expect(fn('domain.com/path/_lists/foo', newSite)).to.equal('domain/_lists/foo');
    expect(fn('domain.com/path/_components/foo/instances/bar', newSite)).to.equal('domain/_components/foo/instances/bar');
    expect(fn('domain.com/path/_pages/foo', newSite)).to.equal('domain/_pages/foo');
    expect(fn('domain.com/path/_uris/foo', newSite)).to.equal('domain/_uris/foo');
  });

  it('throws an error if the URI passed in is not a string', () => {
    const nonStringArgument = function () {
      return fn([0, 1, 2, 3]);
    };

    expect(nonStringArgument).to.throw(Error);
  });
});
