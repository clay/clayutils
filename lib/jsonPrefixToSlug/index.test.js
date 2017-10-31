'use strict';

const name = __filename.split('/').pop().split('.').shift(),
  fn = require('./' + name),
  expect = require('chai').expect,
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
    expect(fn(pageJson, site)).to.equal(expectedPage);
  });

  it('does not affect non-component reference properties (like page url)', function () {
    expect(JSON.parse(fn(pageJson, site)).url).to.equal('http://domain.com/path/foobarbaz.html');
  });

  it('swaps the prefix for the slug for referenced components', function () {
    expect(fn(cmptJson, site, true)).to.equal(expectedCmpt);
  });

  it('does not affect non-component reference properties', function () {
    expect(JSON.parse(fn(cmptJson, site)).image).to.equal('http://domain.com/path/some-img.png');
  });

  it('throws if the JSON argument is not a string', () => {
    const result = () => fn(1);

    expect(result).to.throw('Argument must be a string, not number');
  });
});
