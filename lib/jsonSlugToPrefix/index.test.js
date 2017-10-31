'use strict';

const name = __filename.split('/').pop().split('.').shift(),
  fn = require('./' + name),
  expect = require('chai').expect,
  site = {
    slug: 'domain',
    host: 'domain.com',
    path: '/path'
  },
  expectedPage = JSON.stringify({
    layout: 'domain.com/path/_components/two-column-layout/instances/index',
    url: 'http://domain.com/path/foobarbaz.html',
    main: [
      'domain.com/path/_components/newsfeed/instances/index'
    ]
  }),
  expectedCmpt = JSON.stringify({
    title: 'Cool Title',
    image: 'http://domain.com/path/some-img.png',
    content: [{
      _ref: 'domain.com/path/_components/foo/instances/foo'
    },
    {
      _ref: 'domain.com/path/_components/bar/instances/bar'
    }],
    foobarInstance: {
      _ref: 'domain.com/path/_components/foobar/instances/foobar'
    }
  }),
  pageJson = JSON.stringify({
    layout: 'domain/_components/two-column-layout/instances/index',
    url: 'http://domain.com/path/foobarbaz.html',
    main: [
      'domain/_components/newsfeed/instances/index'
    ]
  }),
  cmptJson = JSON.stringify({
    title: 'Cool Title',
    image: 'http://domain.com/path/some-img.png',
    content: [{
      _ref: 'domain/_components/foo/instances/foo'
    },
    {
      _ref: 'domain/_components/bar/instances/bar'
    }],
    foobarInstance: {
      _ref: 'domain/_components/foobar/instances/foobar'
    }
  });

describe('jsonSlugToPrefix', () => {
  it('swaps the slug for the prefix on when not referenced with "_ref"', function () {
    expect(fn(site)(pageJson)).to.equal(expectedPage);
  });

  it('does not affect non-component reference properties (like page url)', function () {
    expect(JSON.parse(fn(site)(pageJson)).url).to.equal('http://domain.com/path/foobarbaz.html');
  });

  it('swaps the prefix for the slug for referenced components', function () {
    expect(fn(site, true)(cmptJson)).to.equal(expectedCmpt);
  });

  it('does not affect non-component reference properties', function () {
    expect(JSON.parse(fn(site, true)(cmptJson)).image).to.equal('http://domain.com/path/some-img.png');
  });

  it('works with prefix values', function () {
    var newSite = JSON.parse(JSON.stringify(site));

    newSite.prefix = 'domain.com/path';
    expect(fn(newSite)(pageJson)).to.equal(expectedPage);
    expect(JSON.parse(fn(newSite)(pageJson)).url).to.equal('http://domain.com/path/foobarbaz.html');
    expect(fn(newSite, true)(cmptJson)).to.equal(expectedCmpt);
    expect(JSON.parse(fn(newSite, true)(cmptJson)).image).to.equal('http://domain.com/path/some-img.png');
  });

  it('works when no path is defined', function () {
    var newSite = {
      slug: 'domain',
      host: 'domain.com'
    };

    expect(JSON.parse(fn(newSite)(pageJson)).url).to.equal('http://domain.com/path/foobarbaz.html');
    expect(JSON.parse(fn(newSite, true)(cmptJson)).image).to.equal('http://domain.com/path/some-img.png');
  });
});
