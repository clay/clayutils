'use strict';

const { describe, it } = require('node:test'),
  assert = require('node:assert/strict'),
  fs = require('node:fs'),
  path = require('node:path'),
  vm = require('node:vm'),
  lib = require('../index'),
  file = path.join(__dirname, '..', 'dist', 'index.js'),
  code = fs.readFileSync(file, 'utf8'),
  names = Object.keys(lib),
  // every uri shape the functions know about, plus inputs that are not uris at all
  kinds = [''].concat(...['pages', 'components', 'layouts', 'lists', 'uris', 'users', 'sites', 'schedule'].map(kind => [kind, kind.toUpperCase(), kind[0].toUpperCase() + kind.slice(1)])),
  middles = ['', '/base', '/base/instances/0', '/base/instances/foo.bar@published', '/a.b/instances/x@scheduled', '/x/instances/y@latest/meta', '/x/instances/y/META', '/META', '.html@published', '@', '@@x'],
  prefixes = ['', 'nymag.com', 'localhost.cache:3001/press', 'a.b/c', 'https://'],
  notStrings = [undefined, null, 0, NaN, true, {}, [], ['/_pages/x'], new String('/_pages/x'), () => '/_pages/x', Symbol('s')],
  sites = [
    { slug: 'domain', host: 'domain.com', path: '/path' }, { slug: 'domain', host: 'domain.com' }, { slug: 'domain', prefix: 'domain.com/path' },
    { slug: 'a$&', host: 'a.b', path: '/' }, { slug: 'x', host: '(' }, {}, undefined, null
  ],
  page = { head: ['a.com/_components/meta/instances/1'], main: ['a.com/_components/text/instances/2', 'a.com/_components/image/instances/3'], layout: 'a.com/_layouts/l/instances/i' };

/**
 * Run dist/index.js the way a browser does: a context with nothing in it but `exports` and `module`, so the bundle
 * can't reach require, process, Buffer or any other global of Node.
 * @returns {object} what the bundle exports
 */
function loadBundle() {
  const mod = { exports: {} };

  vm.runInContext(code, vm.createContext({ exports: mod.exports, module: mod }), { filename: file });
  return mod.exports;
}

/**
 * What a call comes to. The Error of a bad argument has a message of our own; the message of a TypeError is the
 * engine's wording and contains names from the source, which a minified bundle doesn't have.
 * @param {Function} call
 * @returns {string}
 */
function outcome(call) {
  try {
    const result = call();

    return typeof result === 'function' ? 'function' : JSON.stringify(result);
  } catch (e) {
    return e.name === 'TypeError' ? 'TypeError' : `${e.name}: ${e.message}`;
  }
}

/**
 * Every call to make: [name, ...arguments]
 * @returns {Array<Array>}
 */
function calls() {
  const uris = prefixes.map(prefix => kinds.map(kind => middles.map(middle => `${prefix}/_${kind}${middle}`))).flat(2).concat(notStrings),
    versions = ['published', '', undefined, null, 1],
    withSite = ['uriPrefixToSlug', 'uriSlugToPrefix', 'jsonPrefixToSlug'],
    list = [];

  names.filter(name => !/^(findComponentRefInPage|replaceVersion|uriPrefixToSlug|uriSlugToPrefix|jsonPrefixToSlug|jsonSlugToPrefix)$/.test(name))
    .forEach(name => uris.forEach(uri => list.push([name, uri])));
  uris.forEach((uri) => {
    versions.forEach(version => list.push(['replaceVersion', uri, version]));
    sites.forEach(site => withSite.forEach(name => list.push([name, uri, site])));
  });
  ['meta', 'text', 'image', 'nope', '', undefined].forEach(name => list.push(['findComponentRefInPage', page, name]));
  notStrings.forEach(value => list.push(['findComponentRefInPage', value, 'text']));
  return list;
}

/**
 * jsonSlugToPrefix returns a function: call that too
 * @returns {Array<Array>}
 */
function curriedCalls() {
  const uris = ['"domain/_components/a"', '{"_ref":"domain/_components/a"}', 'x'].concat(notStrings),
    list = [];

  sites.forEach(site => [undefined, true].forEach(ref => uris.forEach(uri => list.push([site, ref, uri]))));
  return list;
}

describe('dist/index.js', () => {
  const bundle = loadBundle();

  it('exports the same names as index.js, in the same order', () => {
    assert.deepEqual(Object.keys(bundle), names);
  });

  it('exports functions of the same length', () => {
    names.forEach((name) => {
      assert.equal(typeof bundle[name], 'function', name);
      assert.equal(bundle[name].length, lib[name].length, name);
    });
  });

  it('exports plain properties on a plain object, like a CommonJS module written by hand', () => {
    assert.equal(Object.getPrototypeOf(bundle), Object.prototype);
    assert.equal(bundle.__esModule, undefined);
    names.forEach((name) => {
      assert.deepEqual(Object.getOwnPropertyDescriptor(bundle, name), { value: bundle[name], writable: true, enumerable: true, configurable: true }, name);
    });
  });

  it('needs nothing from Node', () => {
    assert.doesNotMatch(code, /\brequire\s*\(|\bprocess\b|\bBuffer\b/);
  });

  it('uses no syntax or API newer than ES2017', () => {
    // Kiln and claycli build for browsers around that level: lib/ may not call Object.hasOwn, Array.prototype.at/flat,
    // String.prototype.replaceAll and the like, which a bundler can't lower to older syntax
    assert.doesNotMatch(code, /\?\?|\?\.[A-Za-z_$([]|\bhasOwn\b|\.(?:at|flat|flatMap|replaceAll|matchAll|findLast|findLastIndex|toSorted|toReversed|fromEntries|trimStart|trimEnd)\(|\b(?:globalThis|structuredClone|BigInt)\b/);
  });

  it('gives the same result as index.js for uris, values that are not uris, sites and pages', () => {
    calls().forEach(([name, ...args]) => {
      assert.equal(outcome(() => bundle[name](...args)), outcome(() => lib[name](...args)), `${name}(${args.map(String)})`);
    });
  });

  it('gives the same result as index.js for the function jsonSlugToPrefix returns', () => {
    curriedCalls().forEach(([site, ref, json]) => {
      assert.equal(outcome(() => bundle.jsonSlugToPrefix(site, ref)(json)), outcome(() => lib.jsonSlugToPrefix(site, ref)(json)), `${JSON.stringify(site)} ${ref} ${String(json)}`);
    });
  });
});
