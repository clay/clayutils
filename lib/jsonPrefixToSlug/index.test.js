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

  it('looks for the prefix as text: regular expression characters in it match themselves', () => {
    const json = '{"a":"aXb/_components/x","b":"a.b/_components/x","c":"a(b/_components/x","d":"a+b[c]/_components/x"}';

    assert.equal(fn(json, { slug: 's', host: 'a.b' }), '{"a":"aXb/_components/x","b":"s/_components/x","c":"a(b/_components/x","d":"a+b[c]/_components/x"}');
    assert.equal(fn(json, { slug: 's', host: 'a(b' }), '{"a":"aXb/_components/x","b":"a.b/_components/x","c":"s/_components/x","d":"a+b[c]/_components/x"}');
    assert.equal(fn(json, { slug: 's', prefix: 'a+b[c]' }), '{"a":"aXb/_components/x","b":"a.b/_components/x","c":"a(b/_components/x","d":"s/_components/x"}');
  });

  it('puts the slug in as it is, even with replacement patterns in it', () => {
    assert.equal(fn('{"a":"d.com/_components/x"}', { slug: 'a$&b$1$$', host: 'd.com' }), '{"a":"a$&b$1$$/_components/x"}');
    assert.equal(fn('{"_ref":"d.com/_components/x"}', { slug: '$`', host: 'd.com' }, true), '{"_ref":"$`/_components/x"}');
  });

  it('replaces every occurrence, and only the ones with the right key', () => {
    assert.equal(fn('"d.com/_components/a" "d.com/_components/b" "_ref":"d.com/_components/c"', { slug: 's', host: 'd.com' }), '"s/_components/a" "s/_components/b" "_ref":"s/_components/c"');
    assert.equal(fn('"d.com/_components/a" "_ref":"d.com/_components/c"', { slug: 's', host: 'd.com' }, true), '"d.com/_components/a" "_ref":"s/_components/c"');
  });

  it('checks the json before it reads the site', () => {
    assert.throws(() => fn(5, undefined), { name: 'Error', message: 'Argument must be a string, not number' });
    assert.throws(() => fn(undefined, null), { name: 'Error', message: 'Argument must be a string, not undefined' });
  });
});
