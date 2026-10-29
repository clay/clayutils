'use strict';

const { describe, it } = require('node:test'),
  assert = require('node:assert/strict'),
  fn = require('./index'),
  site = {
    slug: 'domain',
    host: 'domain.com',
    path: '/path'
  },
  pageJson = JSON.stringify({
    layout: 'domain.com/path/_components/two-column-layout/instances/index',
    url: 'http://domain.com/path/foobarbaz.html',
    main: [
      'domain.com/path/_components/newsfeed/instances/index'
    ]
  }),
  cmptJson = JSON.stringify({
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
  expectedPage = JSON.stringify({
    layout: 'domain/_components/two-column-layout/instances/index',
    url: 'http://domain.com/path/foobarbaz.html',
    main: [
      'domain/_components/newsfeed/instances/index'
    ]
  }),
  expectedCmpt = JSON.stringify({
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

describe('jsonPrefixToSlug', () => {
  it('swaps the prefix for the slug on when not referenced with "_ref"', function () {
    assert.equal(fn(pageJson, site), expectedPage);
  });

  it('does not affect non-component reference properties (like page url)', function () {
    assert.equal(JSON.parse(fn(pageJson, site)).url, 'http://domain.com/path/foobarbaz.html');
  });

  it('swaps the prefix for the slug for referenced components', function () {
    assert.equal(fn(cmptJson, site, true), expectedCmpt);
  });

  it('does not affect non-component reference properties', function () {
    assert.equal(JSON.parse(fn(cmptJson, site)).image, 'http://domain.com/path/some-img.png');
  });

  it('works with prefix values', function () {
    var newSite = JSON.parse(JSON.stringify(site));

    newSite.prefix = 'domain.com/path';
    assert.equal(fn(pageJson, newSite), expectedPage);
    assert.equal(JSON.parse(fn(pageJson, newSite)).url, 'http://domain.com/path/foobarbaz.html');
    assert.equal(fn(cmptJson, newSite, true), expectedCmpt);
    assert.equal(JSON.parse(fn(cmptJson, newSite)).image, 'http://domain.com/path/some-img.png');
  });

  it('works when no path is defined', function () {
    var newSite = {
      slug: 'domain',
      host: 'domain.com'
    };

    assert.equal(JSON.parse(fn(pageJson, newSite)).url, 'http://domain.com/path/foobarbaz.html');
    assert.equal(JSON.parse(fn(cmptJson, newSite)).image, 'http://domain.com/path/some-img.png');
  });
});
