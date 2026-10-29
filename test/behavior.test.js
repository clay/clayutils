'use strict';

// What clayutils 3.0.0 returned and threw for these inputs, recorded before the lib was reworked in 3.0.1: the
// functions run on every request, so a change in what they do for odd input (upper case, a '@' in the wrong place,
// characters that change when lower-cased) has to be deliberate. Each list of expected values follows the order of the
// inputs it belongs to.

const { describe, it } = require('node:test'),
  assert = require('node:assert/strict'),
  lib = require('../index'),
  uris = [
    '', ' ', '/', '/_pages', '/_pages/', '_components/base', '/_components/base', '/_components/base/',
    '/_components/base/instances', '/_components/base/instances/0',
    'nymag.com/press/_components/base/instances/foobarbaz@published', 'nymag.com/_components/base.html',
    '/_components/a.b/instances/c.d@e', 'localhost.cache:3001/_components/foo/instances/bar@scheduled',
    'a.com/_components/x@latest', '/_components/a@b@c', '/_components/Base', '/_COMPONENTS/base',
    '/_Components/base/instances/0@published', '/_pages/cj21ud3rt00wmqpyefc944hez@published',
    '/_pages/foo/@published', '/_pages/foo/meta', '/_pages/foo@published/meta', '/_pages/x/META', '/_PAGES/x',
    'site.com/_pages/foo.html', '/_layouts/layout', '/_layouts/layout/instances/gallery',
    '/_layouts/layout/instances/gallery@published/meta', '/_layouts/layout/instances/gallery/meta',
    '/_layouts/layout.html', '/_Layouts/layout', '/_lists/foo', '/_lists/foo/bar', '/_LISTS/foo',
    '/_uris/ZXhhbXBsZS5jb20v', '/_URIS/x', '/_users/abc', '/_USERS/x', '/_sites/x/y', 'www.site.com/_schedule/x', '@',
    '@published', 'a@b@c', '/_pages/K', '/_PAGES/İ', '/_lİsts/foo', '/_ſites/x', '/_users/ı', '/_components/a\nb',
    '/_components/a/instances/b\n', '/_components/a/instances/bé', '/_pages/😀@published'
  ],
  notStrings = [undefined, null, 0, true, {}, [], () => 1, Symbol('s')],
  versions = [
    'published', 'latest', '', undefined, null, 0, 1
  ],
  sites = [
    { slug: 'domain', host: 'domain.com', path: '/path' },
    { slug: 'domain', host: 'domain.com' },
    { slug: 'domain', host: 'domain.com', path: '/' },
    { slug: 'domain', prefix: 'domain.com/path', host: 'ignored.com' },
    { slug: 'a$&b', host: 'a.b' }
  ],
  prefixUris = [
    'domain.com/path/_components/foo/instances/bar', 'domain.com/_components/foo', 'domain.com/path', 'domain.com',
    'domain.com/path/_pages/p@published', 'x.com/_components/y', '', 'a.b/_pages/1'
  ],
  slugUris = [
    'domain/_components/foo/instances/bar', 'domain', 'domain/_pages/p@published', 'x.com/_components/y', '',
    'a$&b/_pages/1', 'domain domain'
  ],
  jsons = [
    '{"layout":"domain.com/path/_components/l/instances/i","main":["domain.com/path/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
    '{"_ref":"domain.com/path/_components/a/instances/b","x":"domain.com/path/_components/c"}',
    '{"layout":"domain/_components/l/instances/i","main":["domain/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
    '{"_ref":"domain/_components/a/instances/b","x":"domain/_components/c"}',
    '"domain.com/_components/a" "domain.com/path/_components/a"',
    'domain/_components/a',
    ''
  ];

/**
 * What a call comes to: its value, or what it threw (the text of a TypeError is the engine's, so only its name counts)
 * @param {Function} call
 * @returns {*}
 */
function outcome(call) {
  try {
    return call();
  } catch (e) {
    return { throws: e.name === 'TypeError' ? 'TypeError' : `${e.name}: ${e.message}` };
  }
}

describe('behaves as 3.0.0 did', () => {
  it('each function answers for each uri as it did', () => {
    const expected = {
      getComponentInstance: [
        null, null, null, null, null, null, null, null, null, '0', 'foobarbaz', null, 'c', 'bar', null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'b\n', 'bé', null
      ],
      getComponentName: [
        null, null, null, null, null, 'base', 'base', 'base', 'base', 'base', 'base', 'base', 'a', 'foo', 'x@latest',
        'a@b@c', 'Base', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'a',
        'a', 'a', null
      ],
      getComponentVersion: [
        null, null, null, null, null, null, null, null, null, null, 'published', null, 'e', 'scheduled', 'latest',
        'b@c', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null
      ],
      getLayoutInstance: [
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, 'gallery', 'gallery', 'gallery', null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null
      ],
      getLayoutName: [
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, 'layout', 'layout', 'layout', 'layout', 'layout', null, null,
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null
      ],
      getPageInstance: [
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, 'cj21ud3rt00wmqpyefc944hez@published', 'foo', 'foo', 'foo@published', 'x', null, 'foo', null, null,
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'K', null,
        null, null, null, null, null, null, '😀@published'
      ],
      getPageVersion: [
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, 'published', 'published', null, 'published/meta', null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null, 'published'
      ],
      getListInstance: [
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'foo', 'foo/bar', null,
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null
      ],
      getPrefix: [
        '', ' ', '/', '', '', '_components/base', '', '', '', '', 'nymag.com/press', 'nymag.com', '',
        'localhost.cache:3001', 'a.com', '', '', '/_COMPONENTS/base', '/_Components/base/instances/0@published', '',
        '', '', '', '', '/_PAGES/x', 'site.com', '', '', '', '', '', '/_Layouts/layout', '', '', '/_LISTS/foo', '',
        '/_URIS/x', '', '/_USERS/x', '', 'www.site.com', '@', '@published', 'a@b@c', '', '/_PAGES/İ', '/_lİsts/foo',
        '/_ſites/x', '', '', '', '', ''
      ],
      isComponent: [
        false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true,
        true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
        false, true, true, true, false
      ],
      isLayout: [
        false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true,
        true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false
      ],
      isLayoutMeta: [
        false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false,
        false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false
      ],
      isDefaultComponent: [
        false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false,
        true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false
      ],
      isDefaultLayout: [
        false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, false,
        false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false
      ],
      isPage: [
        false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false,
        false, false, false, true, true, true, true, true, true, true, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false,
        false, false, false, false, true
      ],
      isPageMeta: [
        false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, true, true, true, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false
      ],
      isPublished: [
        false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false,
        false, false, true, true, true, false, true, false, false, false, false, false, true, false, false, false,
        false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false,
        false, false, false, false, true
      ],
      isList: [
        false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
        false, false, true, true, true, false, false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false
      ],
      isUri: [
        false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false
      ],
      isUser: [
        false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
        false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false,
        false, false, true, false, false, false, false
      ]
    };

    for (const name of Object.keys(expected)) {
      for (const [i, uri] of uris.entries()) {
        assert.deepEqual(outcome(() => lib[name](uri)), expected[name][i], `${name}(${JSON.stringify(uri)})`);
      }
    }
  });

  it('each function rejects what is not a string with the same Error', () => {
    const expected = {
      getComponentInstance: [
        { throws: 'Error: Argument must be a string, not undefined' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not number' },
        { throws: 'Error: Argument must be a string, not boolean' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not function' },
        { throws: 'Error: Argument must be a string, not symbol' }
      ],
      getComponentName: [
        { throws: 'Error: Argument must be a string, not undefined' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not number' },
        { throws: 'Error: Argument must be a string, not boolean' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not function' },
        { throws: 'Error: Argument must be a string, not symbol' }
      ],
      getComponentVersion: [
        { throws: 'Error: Argument must be a string, not undefined' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not number' },
        { throws: 'Error: Argument must be a string, not boolean' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not function' },
        { throws: 'Error: Argument must be a string, not symbol' }
      ],
      getLayoutInstance: [
        { throws: 'Error: Argument must be a string, not undefined' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not number' },
        { throws: 'Error: Argument must be a string, not boolean' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not function' },
        { throws: 'Error: Argument must be a string, not symbol' }
      ],
      getLayoutName: [
        { throws: 'Error: Argument must be a string, not undefined' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not number' },
        { throws: 'Error: Argument must be a string, not boolean' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not function' },
        { throws: 'Error: Argument must be a string, not symbol' }
      ],
      getPageInstance: [
        { throws: 'Error: Argument must be a string, not undefined' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not number' },
        { throws: 'Error: Argument must be a string, not boolean' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not function' },
        { throws: 'Error: Argument must be a string, not symbol' }
      ],
      getPageVersion: [
        { throws: 'Error: Argument must be a string, not undefined' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not number' },
        { throws: 'Error: Argument must be a string, not boolean' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not function' },
        { throws: 'Error: Argument must be a string, not symbol' }
      ],
      getListInstance: [
        { throws: 'Error: Argument must be a string, not undefined' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not number' },
        { throws: 'Error: Argument must be a string, not boolean' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not function' },
        { throws: 'Error: Argument must be a string, not symbol' }
      ],
      getPrefix: [
        { throws: 'Error: Argument must be a string, not undefined' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not number' },
        { throws: 'Error: Argument must be a string, not boolean' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not function' },
        { throws: 'Error: Argument must be a string, not symbol' }
      ],
      isComponent: [
        { throws: 'Error: Argument must be a string, not undefined' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not number' },
        { throws: 'Error: Argument must be a string, not boolean' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not function' },
        { throws: 'Error: Argument must be a string, not symbol' }
      ],
      isLayout: [
        { throws: 'Error: Argument must be a string, not undefined' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not number' },
        { throws: 'Error: Argument must be a string, not boolean' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not function' },
        { throws: 'Error: Argument must be a string, not symbol' }
      ],
      isLayoutMeta: [
        { throws: 'Error: Argument must be a string, not undefined' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not number' },
        { throws: 'Error: Argument must be a string, not boolean' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not function' },
        { throws: 'Error: Argument must be a string, not symbol' }
      ],
      isDefaultComponent: [
        { throws: 'Error: Argument must be a string, not undefined' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not number' },
        { throws: 'Error: Argument must be a string, not boolean' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not function' },
        { throws: 'Error: Argument must be a string, not symbol' }
      ],
      isDefaultLayout: [
        { throws: 'Error: Argument must be a string, not undefined' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not number' },
        { throws: 'Error: Argument must be a string, not boolean' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not function' },
        { throws: 'Error: Argument must be a string, not symbol' }
      ],
      isPage: [
        { throws: 'Error: Argument must be a string, not undefined' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not number' },
        { throws: 'Error: Argument must be a string, not boolean' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not function' },
        { throws: 'Error: Argument must be a string, not symbol' }
      ],
      isPageMeta: [
        { throws: 'Error: Argument must be a string, not undefined' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not number' },
        { throws: 'Error: Argument must be a string, not boolean' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not function' },
        { throws: 'Error: Argument must be a string, not symbol' }
      ],
      isPublished: [
        { throws: 'Error: Argument must be a string, not undefined' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not number' },
        { throws: 'Error: Argument must be a string, not boolean' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not function' },
        { throws: 'Error: Argument must be a string, not symbol' }
      ],
      isList: [
        { throws: 'Error: Argument must be a string, not undefined' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not number' },
        { throws: 'Error: Argument must be a string, not boolean' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not function' },
        { throws: 'Error: Argument must be a string, not symbol' }
      ],
      isUri: [
        { throws: 'Error: Argument must be a string, not undefined' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not number' },
        { throws: 'Error: Argument must be a string, not boolean' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not function' },
        { throws: 'Error: Argument must be a string, not symbol' }
      ],
      isUser: [
        { throws: 'Error: Argument must be a string, not undefined' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not number' },
        { throws: 'Error: Argument must be a string, not boolean' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not object' },
        { throws: 'Error: Argument must be a string, not function' },
        { throws: 'Error: Argument must be a string, not symbol' }
      ]
    };

    for (const name of Object.keys(expected)) {
      for (const [i, value] of notStrings.entries()) {
        assert.deepEqual(outcome(() => lib[name](value)), expected[name][i], `${name}(${String(value)})`);
      }
    }
  });

  it('replaceVersion answers for each uri and version as it did', () => {
    const expected = [
      '@published', '@latest', '', '', '', '', '@1', ' @published', ' @latest', ' ', ' ', ' ', ' ', ' @1',
      '/@published', '/@latest', '/', '/', '/', '/', '/@1', '/_pages@published', '/_pages@latest', '/_pages',
      '/_pages', '/_pages', '/_pages', '/_pages@1', '/_pages/@published', '/_pages/@latest', '/_pages/', '/_pages/',
      '/_pages/', '/_pages/', '/_pages/@1', '_components/base@published', '_components/base@latest',
      '_components/base', '_components/base', '_components/base', '_components/base', '_components/base@1',
      '/_components/base@published', '/_components/base@latest', '/_components/base', '/_components/base',
      '/_components/base', '/_components/base', '/_components/base@1', '/_components/base/@published',
      '/_components/base/@latest', '/_components/base/', '/_components/base/', '/_components/base/',
      '/_components/base/', '/_components/base/@1', '/_components/base/instances@published',
      '/_components/base/instances@latest', '/_components/base/instances', '/_components/base/instances',
      '/_components/base/instances', '/_components/base/instances', '/_components/base/instances@1',
      '/_components/base/instances/0@published', '/_components/base/instances/0@latest',
      '/_components/base/instances/0', '/_components/base/instances/0', '/_components/base/instances/0',
      '/_components/base/instances/0', '/_components/base/instances/0@1',
      'nymag.com/press/_components/base/instances/foobarbaz@published',
      'nymag.com/press/_components/base/instances/foobarbaz@latest',
      'nymag.com/press/_components/base/instances/foobarbaz', 'nymag.com/press/_components/base/instances/foobarbaz',
      'nymag.com/press/_components/base/instances/foobarbaz', 'nymag.com/press/_components/base/instances/foobarbaz',
      'nymag.com/press/_components/base/instances/foobarbaz@1', 'nymag.com/_components/base.html@published',
      'nymag.com/_components/base.html@latest', 'nymag.com/_components/base.html', 'nymag.com/_components/base.html',
      'nymag.com/_components/base.html', 'nymag.com/_components/base.html', 'nymag.com/_components/base.html@1',
      '/_components/a.b/instances/c.d@published', '/_components/a.b/instances/c.d@latest',
      '/_components/a.b/instances/c.d', '/_components/a.b/instances/c.d', '/_components/a.b/instances/c.d',
      '/_components/a.b/instances/c.d', '/_components/a.b/instances/c.d@1',
      'localhost.cache:3001/_components/foo/instances/bar@published',
      'localhost.cache:3001/_components/foo/instances/bar@latest',
      'localhost.cache:3001/_components/foo/instances/bar', 'localhost.cache:3001/_components/foo/instances/bar',
      'localhost.cache:3001/_components/foo/instances/bar', 'localhost.cache:3001/_components/foo/instances/bar',
      'localhost.cache:3001/_components/foo/instances/bar@1', 'a.com/_components/x@published',
      'a.com/_components/x@latest', 'a.com/_components/x', 'a.com/_components/x', 'a.com/_components/x',
      'a.com/_components/x', 'a.com/_components/x@1', '/_components/a@published', '/_components/a@latest',
      '/_components/a', '/_components/a', '/_components/a', '/_components/a', '/_components/a@1',
      '/_components/Base@published', '/_components/Base@latest', '/_components/Base', '/_components/Base',
      '/_components/Base', '/_components/Base', '/_components/Base@1', '/_COMPONENTS/base@published',
      '/_COMPONENTS/base@latest', '/_COMPONENTS/base', '/_COMPONENTS/base', '/_COMPONENTS/base', '/_COMPONENTS/base',
      '/_COMPONENTS/base@1', '/_Components/base/instances/0@published', '/_Components/base/instances/0@latest',
      '/_Components/base/instances/0', '/_Components/base/instances/0', '/_Components/base/instances/0',
      '/_Components/base/instances/0', '/_Components/base/instances/0@1',
      '/_pages/cj21ud3rt00wmqpyefc944hez@published', '/_pages/cj21ud3rt00wmqpyefc944hez@latest',
      '/_pages/cj21ud3rt00wmqpyefc944hez', '/_pages/cj21ud3rt00wmqpyefc944hez', '/_pages/cj21ud3rt00wmqpyefc944hez',
      '/_pages/cj21ud3rt00wmqpyefc944hez', '/_pages/cj21ud3rt00wmqpyefc944hez@1', '/_pages/foo/@published',
      '/_pages/foo/@latest', '/_pages/foo/', '/_pages/foo/', '/_pages/foo/', '/_pages/foo/', '/_pages/foo/@1',
      '/_pages/foo/meta@published', '/_pages/foo/meta@latest', '/_pages/foo/meta', '/_pages/foo/meta',
      '/_pages/foo/meta', '/_pages/foo/meta', '/_pages/foo/meta@1', '/_pages/foo@published', '/_pages/foo@latest',
      '/_pages/foo', '/_pages/foo', '/_pages/foo', '/_pages/foo', '/_pages/foo@1', '/_pages/x/META@published',
      '/_pages/x/META@latest', '/_pages/x/META', '/_pages/x/META', '/_pages/x/META', '/_pages/x/META',
      '/_pages/x/META@1', '/_PAGES/x@published', '/_PAGES/x@latest', '/_PAGES/x', '/_PAGES/x', '/_PAGES/x',
      '/_PAGES/x', '/_PAGES/x@1', 'site.com/_pages/foo.html@published', 'site.com/_pages/foo.html@latest',
      'site.com/_pages/foo.html', 'site.com/_pages/foo.html', 'site.com/_pages/foo.html', 'site.com/_pages/foo.html',
      'site.com/_pages/foo.html@1', '/_layouts/layout@published', '/_layouts/layout@latest', '/_layouts/layout',
      '/_layouts/layout', '/_layouts/layout', '/_layouts/layout', '/_layouts/layout@1',
      '/_layouts/layout/instances/gallery@published', '/_layouts/layout/instances/gallery@latest',
      '/_layouts/layout/instances/gallery', '/_layouts/layout/instances/gallery',
      '/_layouts/layout/instances/gallery', '/_layouts/layout/instances/gallery',
      '/_layouts/layout/instances/gallery@1', '/_layouts/layout/instances/gallery@published',
      '/_layouts/layout/instances/gallery@latest', '/_layouts/layout/instances/gallery',
      '/_layouts/layout/instances/gallery', '/_layouts/layout/instances/gallery',
      '/_layouts/layout/instances/gallery', '/_layouts/layout/instances/gallery@1',
      '/_layouts/layout/instances/gallery/meta@published', '/_layouts/layout/instances/gallery/meta@latest',
      '/_layouts/layout/instances/gallery/meta', '/_layouts/layout/instances/gallery/meta',
      '/_layouts/layout/instances/gallery/meta', '/_layouts/layout/instances/gallery/meta',
      '/_layouts/layout/instances/gallery/meta@1', '/_layouts/layout.html@published', '/_layouts/layout.html@latest',
      '/_layouts/layout.html', '/_layouts/layout.html', '/_layouts/layout.html', '/_layouts/layout.html',
      '/_layouts/layout.html@1', '/_Layouts/layout@published', '/_Layouts/layout@latest', '/_Layouts/layout',
      '/_Layouts/layout', '/_Layouts/layout', '/_Layouts/layout', '/_Layouts/layout@1', '/_lists/foo@published',
      '/_lists/foo@latest', '/_lists/foo', '/_lists/foo', '/_lists/foo', '/_lists/foo', '/_lists/foo@1',
      '/_lists/foo/bar@published', '/_lists/foo/bar@latest', '/_lists/foo/bar', '/_lists/foo/bar', '/_lists/foo/bar',
      '/_lists/foo/bar', '/_lists/foo/bar@1', '/_LISTS/foo@published', '/_LISTS/foo@latest', '/_LISTS/foo',
      '/_LISTS/foo', '/_LISTS/foo', '/_LISTS/foo', '/_LISTS/foo@1', '/_uris/ZXhhbXBsZS5jb20v@published',
      '/_uris/ZXhhbXBsZS5jb20v@latest', '/_uris/ZXhhbXBsZS5jb20v', '/_uris/ZXhhbXBsZS5jb20v',
      '/_uris/ZXhhbXBsZS5jb20v', '/_uris/ZXhhbXBsZS5jb20v', '/_uris/ZXhhbXBsZS5jb20v@1', '/_URIS/x@published',
      '/_URIS/x@latest', '/_URIS/x', '/_URIS/x', '/_URIS/x', '/_URIS/x', '/_URIS/x@1', '/_users/abc@published',
      '/_users/abc@latest', '/_users/abc', '/_users/abc', '/_users/abc', '/_users/abc', '/_users/abc@1',
      '/_USERS/x@published', '/_USERS/x@latest', '/_USERS/x', '/_USERS/x', '/_USERS/x', '/_USERS/x', '/_USERS/x@1',
      '/_sites/x/y@published', '/_sites/x/y@latest', '/_sites/x/y', '/_sites/x/y', '/_sites/x/y', '/_sites/x/y',
      '/_sites/x/y@1', 'www.site.com/_schedule/x@published', 'www.site.com/_schedule/x@latest',
      'www.site.com/_schedule/x', 'www.site.com/_schedule/x', 'www.site.com/_schedule/x', 'www.site.com/_schedule/x',
      'www.site.com/_schedule/x@1', '@published', '@latest', '', '', '', '', '@1', '@published', '@latest', '', '',
      '', '', '@1', 'a@published', 'a@latest', 'a', 'a', 'a', 'a', 'a@1', '/_pages/K@published', '/_pages/K@latest',
      '/_pages/K', '/_pages/K', '/_pages/K', '/_pages/K', '/_pages/K@1', '/_PAGES/İ@published', '/_PAGES/İ@latest',
      '/_PAGES/İ', '/_PAGES/İ', '/_PAGES/İ', '/_PAGES/İ', '/_PAGES/İ@1', '/_lİsts/foo@published',
      '/_lİsts/foo@latest', '/_lİsts/foo', '/_lİsts/foo', '/_lİsts/foo', '/_lİsts/foo', '/_lİsts/foo@1',
      '/_ſites/x@published', '/_ſites/x@latest', '/_ſites/x', '/_ſites/x', '/_ſites/x', '/_ſites/x', '/_ſites/x@1',
      '/_users/ı@published', '/_users/ı@latest', '/_users/ı', '/_users/ı', '/_users/ı', '/_users/ı', '/_users/ı@1',
      '/_components/a\nb@published', '/_components/a\nb@latest', '/_components/a\nb', '/_components/a\nb',
      '/_components/a\nb', '/_components/a\nb', '/_components/a\nb@1', '/_components/a/instances/b\n@published',
      '/_components/a/instances/b\n@latest', '/_components/a/instances/b\n', '/_components/a/instances/b\n',
      '/_components/a/instances/b\n', '/_components/a/instances/b\n', '/_components/a/instances/b\n@1',
      '/_components/a/instances/bé@published', '/_components/a/instances/bé@latest', '/_components/a/instances/bé',
      '/_components/a/instances/bé', '/_components/a/instances/bé', '/_components/a/instances/bé',
      '/_components/a/instances/bé@1', '/_pages/😀@published', '/_pages/😀@latest', '/_pages/😀', '/_pages/😀',
      '/_pages/😀', '/_pages/😀', '/_pages/😀@1'
    ];

    for (const [i, uri] of uris.entries()) {
      for (const [j, version] of versions.entries()) {
        assert.deepEqual(outcome(() => lib.replaceVersion(uri, version)), expected[i * versions.length + j], `replaceVersion(${JSON.stringify(uri)}, ${String(version)})`);
      }
    }
  });

  it('uriPrefixToSlug answers for each uri and site as it did', () => {
    const expected = [
      'domain/_components/foo/instances/bar', 'domain/path/_components/foo/instances/bar',
      'domain/path/_components/foo/instances/bar', 'domain/_components/foo/instances/bar',
      'domain.com/path/_components/foo/instances/bar', 'domain.com/_components/foo', 'domain/_components/foo',
      'domain/_components/foo', 'domain.com/_components/foo', 'domain.com/_components/foo', 'domain', 'domain/path',
      'domain/path', 'domain', 'domain.com/path', 'domain.com', 'domain', 'domain', 'domain.com', 'domain.com',
      'domain/_pages/p@published', 'domain/path/_pages/p@published', 'domain/path/_pages/p@published',
      'domain/_pages/p@published', 'domain.com/path/_pages/p@published', 'x.com/_components/y', 'x.com/_components/y',
      'x.com/_components/y', 'x.com/_components/y', 'x.com/_components/y', '', '', '', '', '', 'a.b/_pages/1',
      'a.b/_pages/1', 'a.b/_pages/1', 'a.b/_pages/1', 'aa.b/b/_pages/1'
    ];

    for (const [i, uri] of prefixUris.entries()) {
      for (const [j, site] of sites.entries()) {
        assert.deepEqual(outcome(() => lib.uriPrefixToSlug(uri, site)), expected[i * sites.length + j], `uriPrefixToSlug(${JSON.stringify(uri)}, ${JSON.stringify(site)})`);
      }
    }
  });

  it('uriSlugToPrefix answers for each uri and site as it did', () => {
    const expected = [
      'domain.com/path/_components/foo/instances/bar', 'domain.com/_components/foo/instances/bar',
      'domain.com/_components/foo/instances/bar', 'domain.com/path/_components/foo/instances/bar',
      'domain/_components/foo/instances/bar', 'domain.com/path', 'domain.com', 'domain.com', 'domain.com/path',
      'domain', 'domain.com/path/_pages/p@published', 'domain.com/_pages/p@published',
      'domain.com/_pages/p@published', 'domain.com/path/_pages/p@published', 'domain/_pages/p@published',
      'x.com/_components/y', 'x.com/_components/y', 'x.com/_components/y', 'x.com/_components/y',
      'x.com/_components/y', '', '', '', '', '', 'a$&b/_pages/1', 'a$&b/_pages/1', 'a$&b/_pages/1', 'a$&b/_pages/1',
      'a.b/_pages/1', 'domain.com/path domain', 'domain.com domain', 'domain.com domain', 'domain.com/path domain',
      'domain domain'
    ];

    for (const [i, uri] of slugUris.entries()) {
      for (const [j, site] of sites.entries()) {
        assert.deepEqual(outcome(() => lib.uriSlugToPrefix(uri, site)), expected[i * sites.length + j], `uriSlugToPrefix(${JSON.stringify(uri)}, ${JSON.stringify(site)})`);
      }
    }
  });

  it('jsonPrefixToSlug answers for each json and site, with and without ref, as it did', () => {
    const expected = [
      '{"layout":"domain/_components/l/instances/i","main":["domain/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain.com/path/_components/l/instances/i","main":["domain.com/path/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain.com/path/_components/l/instances/i","main":["domain.com/path/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain.com/path/_components/l/instances/i","main":["domain.com/path/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain.com/path/_components/l/instances/i","main":["domain.com/path/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain.com/path/_components/l/instances/i","main":["domain.com/path/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain/_components/l/instances/i","main":["domain/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain.com/path/_components/l/instances/i","main":["domain.com/path/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain.com/path/_components/l/instances/i","main":["domain.com/path/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain.com/path/_components/l/instances/i","main":["domain.com/path/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"_ref":"domain/_components/a/instances/b","x":"domain/_components/c"}',
      '{"_ref":"domain/_components/a/instances/b","x":"domain.com/path/_components/c"}',
      '{"_ref":"domain.com/path/_components/a/instances/b","x":"domain.com/path/_components/c"}',
      '{"_ref":"domain.com/path/_components/a/instances/b","x":"domain.com/path/_components/c"}',
      '{"_ref":"domain.com/path/_components/a/instances/b","x":"domain.com/path/_components/c"}',
      '{"_ref":"domain.com/path/_components/a/instances/b","x":"domain.com/path/_components/c"}',
      '{"_ref":"domain/_components/a/instances/b","x":"domain/_components/c"}',
      '{"_ref":"domain/_components/a/instances/b","x":"domain.com/path/_components/c"}',
      '{"_ref":"domain.com/path/_components/a/instances/b","x":"domain.com/path/_components/c"}',
      '{"_ref":"domain.com/path/_components/a/instances/b","x":"domain.com/path/_components/c"}',
      '{"layout":"domain/_components/l/instances/i","main":["domain/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain/_components/l/instances/i","main":["domain/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain/_components/l/instances/i","main":["domain/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain/_components/l/instances/i","main":["domain/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain/_components/l/instances/i","main":["domain/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain/_components/l/instances/i","main":["domain/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain/_components/l/instances/i","main":["domain/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain/_components/l/instances/i","main":["domain/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain/_components/l/instances/i","main":["domain/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain/_components/l/instances/i","main":["domain/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"_ref":"domain/_components/a/instances/b","x":"domain/_components/c"}',
      '{"_ref":"domain/_components/a/instances/b","x":"domain/_components/c"}',
      '{"_ref":"domain/_components/a/instances/b","x":"domain/_components/c"}',
      '{"_ref":"domain/_components/a/instances/b","x":"domain/_components/c"}',
      '{"_ref":"domain/_components/a/instances/b","x":"domain/_components/c"}',
      '{"_ref":"domain/_components/a/instances/b","x":"domain/_components/c"}',
      '{"_ref":"domain/_components/a/instances/b","x":"domain/_components/c"}',
      '{"_ref":"domain/_components/a/instances/b","x":"domain/_components/c"}',
      '{"_ref":"domain/_components/a/instances/b","x":"domain/_components/c"}',
      '{"_ref":"domain/_components/a/instances/b","x":"domain/_components/c"}',
      '"domain.com/_components/a" "domain/_components/a"',
      '"domain.com/_components/a" "domain.com/path/_components/a"',
      '"domain/_components/a" "domain.com/path/_components/a"',
      '"domain.com/_components/a" "domain.com/path/_components/a"',
      '"domain/_components/a" "domain.com/path/_components/a"',
      '"domain.com/_components/a" "domain.com/path/_components/a"',
      '"domain.com/_components/a" "domain/_components/a"',
      '"domain.com/_components/a" "domain.com/path/_components/a"',
      '"domain.com/_components/a" "domain.com/path/_components/a"',
      '"domain.com/_components/a" "domain.com/path/_components/a"', 'domain/_components/a', 'domain/_components/a',
      'domain/_components/a', 'domain/_components/a', 'domain/_components/a', 'domain/_components/a',
      'domain/_components/a', 'domain/_components/a', 'domain/_components/a', 'domain/_components/a', '', '', '', '',
      '', '', '', '', '', ''
    ];
    let n = 0;

    for (const json of jsons) {
      for (const site of sites) {
        for (const ref of [undefined, true]) {
          assert.deepEqual(outcome(() => lib.jsonPrefixToSlug(json, site, ref)), expected[n++], `jsonPrefixToSlug(${JSON.stringify(json)}, ${JSON.stringify(site)}, ${ref})`);
        }
      }
    }
  });

  it('jsonSlugToPrefix answers for each json and site, with and without ref, as it did', () => {
    const expected = [
      '{"layout":"domain.com/path/_components/l/instances/i","main":["domain.com/path/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain.com/path/_components/l/instances/i","main":["domain.com/path/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain.com/path/_components/l/instances/i","main":["domain.com/path/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain.com/path/_components/l/instances/i","main":["domain.com/path/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain.com/path/_components/l/instances/i","main":["domain.com/path/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain.com/path/_components/l/instances/i","main":["domain.com/path/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain.com/path/_components/l/instances/i","main":["domain.com/path/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain.com/path/_components/l/instances/i","main":["domain.com/path/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain.com/path/_components/l/instances/i","main":["domain.com/path/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain.com/path/_components/l/instances/i","main":["domain.com/path/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"_ref":"domain.com/path/_components/a/instances/b","x":"domain.com/path/_components/c"}',
      '{"_ref":"domain.com/path/_components/a/instances/b","x":"domain.com/path/_components/c"}',
      '{"_ref":"domain.com/path/_components/a/instances/b","x":"domain.com/path/_components/c"}',
      '{"_ref":"domain.com/path/_components/a/instances/b","x":"domain.com/path/_components/c"}',
      '{"_ref":"domain.com/path/_components/a/instances/b","x":"domain.com/path/_components/c"}',
      '{"_ref":"domain.com/path/_components/a/instances/b","x":"domain.com/path/_components/c"}',
      '{"_ref":"domain.com/path/_components/a/instances/b","x":"domain.com/path/_components/c"}',
      '{"_ref":"domain.com/path/_components/a/instances/b","x":"domain.com/path/_components/c"}',
      '{"_ref":"domain.com/path/_components/a/instances/b","x":"domain.com/path/_components/c"}',
      '{"_ref":"domain.com/path/_components/a/instances/b","x":"domain.com/path/_components/c"}',
      '{"layout":"domain.com/path/_components/l/instances/i","main":["domain.com/path/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain/_components/l/instances/i","main":["domain/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain.com/_components/l/instances/i","main":["domain.com/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain/_components/l/instances/i","main":["domain/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain.com/_components/l/instances/i","main":["domain.com/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain/_components/l/instances/i","main":["domain/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain.com/path/_components/l/instances/i","main":["domain.com/path/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain/_components/l/instances/i","main":["domain/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain/_components/l/instances/i","main":["domain/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"layout":"domain/_components/l/instances/i","main":["domain/_components/a/instances/b"],"url":"http://domain.com/path/x.html"}',
      '{"_ref":"domain.com/path/_components/a/instances/b","x":"domain.com/path/_components/c"}',
      '{"_ref":"domain.com/path/_components/a/instances/b","x":"domain/_components/c"}',
      '{"_ref":"domain.com/_components/a/instances/b","x":"domain.com/_components/c"}',
      '{"_ref":"domain.com/_components/a/instances/b","x":"domain/_components/c"}',
      '{"_ref":"domain.com/_components/a/instances/b","x":"domain.com/_components/c"}',
      '{"_ref":"domain.com/_components/a/instances/b","x":"domain/_components/c"}',
      '{"_ref":"domain.com/path/_components/a/instances/b","x":"domain.com/path/_components/c"}',
      '{"_ref":"domain.com/path/_components/a/instances/b","x":"domain/_components/c"}',
      '{"_ref":"domain/_components/a/instances/b","x":"domain/_components/c"}',
      '{"_ref":"domain/_components/a/instances/b","x":"domain/_components/c"}',
      '"domain.com/_components/a" "domain.com/path/_components/a"',
      '"domain.com/_components/a" "domain.com/path/_components/a"',
      '"domain.com/_components/a" "domain.com/path/_components/a"',
      '"domain.com/_components/a" "domain.com/path/_components/a"',
      '"domain.com/_components/a" "domain.com/path/_components/a"',
      '"domain.com/_components/a" "domain.com/path/_components/a"',
      '"domain.com/_components/a" "domain.com/path/_components/a"',
      '"domain.com/_components/a" "domain.com/path/_components/a"',
      '"domain.com/_components/a" "domain.com/path/_components/a"',
      '"domain.com/_components/a" "domain.com/path/_components/a"', 'domain/_components/a', 'domain/_components/a',
      'domain/_components/a', 'domain/_components/a', 'domain/_components/a', 'domain/_components/a',
      'domain/_components/a', 'domain/_components/a', 'domain/_components/a', 'domain/_components/a', '', '', '', '',
      '', '', '', '', '', ''
    ];
    let n = 0;

    for (const json of jsons) {
      for (const site of sites) {
        for (const ref of [undefined, true]) {
          assert.deepEqual(outcome(() => lib.jsonSlugToPrefix(site, ref)(json)), expected[n++], `jsonSlugToPrefix(${JSON.stringify(json)}, ${JSON.stringify(site)}, ${ref})`);
        }
      }
    }
  });

  it('findComponentRefInPage looks in every area, in order, and stops at the first match', () => {
    const page = { head: [ 'a.com/_components/meta/instances/1' ], main: [ 'a.com/_components/text/instances/2', 'a.com/_components/image/instances/3' ], layout: 'a.com/_layouts/l/instances/i' },
      names = [ 'meta', 'text', 'image', 'nope', '', undefined ],
      expected = [ 'a.com/_components/meta/instances/1', 'a.com/_components/text/instances/2', 'a.com/_components/image/instances/3', undefined, undefined, { throws: 'Error: Argument must be a string, not undefined' } ],
      withBad = { a: [ 'a.com/_components/x/instances/1' ], b: [ 1 ] };

    for (const [i, name] of names.entries()) {
      assert.deepEqual(outcome(() => lib.findComponentRefInPage(page, name)), expected[i], String(name));
    }
    assert.deepEqual(outcome(() => lib.findComponentRefInPage(withBad, 'zzz')), { throws: 'Error: Argument must be a string, not number' });
    assert.deepEqual(outcome(() => lib.findComponentRefInPage(withBad, 'x')), 'a.com/_components/x/instances/1');
    assert.deepEqual(outcome(() => lib.findComponentRefInPage('page', 'x')), { throws: 'Error: Page argument must be an object, not string' });
    assert.deepEqual(outcome(() => lib.findComponentRefInPage(null, 'x')), { throws: 'TypeError' });
    assert.deepEqual(outcome(() => lib.findComponentRefInPage({}, 1)), { throws: 'Error: Argument must be a string, not number' });
  });
});

