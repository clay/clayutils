'use strict';

const { describe, it } = require('node:test'),
  assert = require('node:assert/strict'),
  fs = require('node:fs'),
  path = require('node:path'),
  vm = require('node:vm'),
  lib = require('../index'),
  root = path.join(__dirname, '..'),
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
 * Run index.js and the files it requires the way a bundler's output runs in a browser: in a context with nothing in it
 * (no process, Buffer, console, setTimeout...), where a require can only reach another file of this package. Anything else
 * a function needed, a built-in module or a dependency, fails here.
 * @returns {{exports: object, files: string[]}} what index.js exports and the files that were run
 */
function loadInBrowserContext() {
  const context = vm.createContext({}), loaded = new Map();

  function load(file) {
    if (!loaded.has(file)) {
      const mod = { exports: {} },
        run = vm.runInContext(`(function (exports, require, module) {${fs.readFileSync(file, 'utf8')}\n})`, context, { filename: `browser:${path.relative(root, file)}` }),
        resolve = (spec) => {
          const target = path.resolve(path.dirname(file), spec),
            found = [target, `${target}.js`, path.join(target, 'index.js')].find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());

          if (!spec.startsWith('.') || !found || !found.startsWith(root + path.sep)) {
            throw new Error(`${path.relative(root, file)} requires ${spec}, which is not a file of this package`);
          }
          return found;
        };

      loaded.set(file, mod);
      run(mod.exports, spec => load(resolve(spec)).exports, mod);
    }
    return loaded.get(file);
  }

  return { exports: load(path.join(root, 'index.js')).exports, files: [...loaded.keys()].map(file => path.relative(root, file)).sort() };
}

/**
 * What a call comes to, as text
 * @param {Function} call
 * @returns {string}
 */
function outcome(call) {
  try {
    const result = call();

    return typeof result === 'function' ? 'function' : JSON.stringify(result);
  } catch (e) {
    return `${e.name}: ${e.message}`;
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
  notStrings.concat(null).forEach(value => list.push(['findComponentRefInPage', value, 'text']));
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

describe('in a browser context', () => {
  const browser = loadInBrowserContext();

  it('index.js loads, and exports the same names in the same order', () => {
    assert.deepEqual(Object.keys(browser.exports), names);
    names.forEach((name) => {
      assert.equal(typeof browser.exports[name], 'function', name);
      assert.equal(browser.exports[name].length, lib[name].length, name);
    });
  });

  it('runs every file of lib, and no file that is not in lib', () => {
    const shipped = fs.readdirSync(path.join(root, 'lib'), { withFileTypes: true })
      .map(entry => entry.isDirectory() ? path.join('lib', entry.name, 'index.js') : path.join('lib', entry.name))
      .filter(file => !file.endsWith('.test.js'));

    assert.deepEqual(browser.files, ['index.js', ...shipped].sort());
  });

  it('uses no syntax or API newer than ES2017', () => {
    // Kiln and claycli build for browsers around that level and don't lower APIs: lib/ may not call Object.hasOwn,
    // Array.prototype.at/flat, String.prototype.replaceAll and the like
    browser.files.forEach((file) => {
      const code = fs.readFileSync(path.join(root, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

      assert.doesNotMatch(code, /\?\?|\?\.[A-Za-z_$([]|\bhasOwn\b|\.(?:at|flat|flatMap|replaceAll|matchAll|findLast|findLastIndex|toSorted|toReversed|fromEntries|trimStart|trimEnd)\(|\b(?:globalThis|structuredClone|BigInt)\b/, file);
    });
  });

  it('gives the same result as index.js for uris, values that are not uris, sites and pages', () => {
    calls().forEach(([name, ...args]) => {
      assert.equal(outcome(() => browser.exports[name](...args)), outcome(() => lib[name](...args)), `${name}(${args.map(String)})`);
    });
  });

  it('gives the same result as index.js for the function jsonSlugToPrefix returns', () => {
    curriedCalls().forEach(([site, ref, json]) => {
      assert.equal(outcome(() => browser.exports.jsonSlugToPrefix(site, ref)(json)), outcome(() => lib.jsonSlugToPrefix(site, ref)(json)), `${JSON.stringify(site)} ${ref} ${String(json)}`);
    });
  });
});
