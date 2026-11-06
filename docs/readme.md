# clayutils

[![CI](https://github.com/clay/clayutils/actions/workflows/ci.yml/badge.svg)](https://github.com/clay/clayutils/actions/workflows/ci.yml)

Utility functions for working with Clay.

Version 2.x is compatible with Amphora 5.x. For pre-5.x utilities refer to 1.x releases.

# Installation

```
npm install --save clayutils
```

Requires Node 26.12.1 or newer. There are no dependencies, and no build output: `index.js` and the files in `lib/` are what a bundler gets for a browser, in plain ES2017 (nothing newer than `Object.values`).

# Upgrading from 3.x

4.0.0 has the same 26 functions. What is different:

* Node 26.12.1 or newer (`engines`).
* There is no `dist/index.js` and no `browser` field any more: a bundler resolves `index.js`, as it does for any other CommonJS package.
* `uriPrefixToSlug`, `uriSlugToPrefix`, `jsonPrefixToSlug` and `jsonSlugToPrefix` check that the uri or json is a string before they read the site, so a number or a boolean gives `Argument must be a string, not number` instead of a `TypeError` about `uri.indexOf` or the site.
* `uriPrefixToSlug` and `uriSlugToPrefix` put the slug or prefix in as it is: `$&`, `$1` or `$$` in it were read as replacement patterns.
* `jsonPrefixToSlug` and `jsonSlugToPrefix` look for the prefix or slug as the text it is. They built a regular expression out of it, so a `.` matched any character and a `(` or `[` threw a `SyntaxError`.
* `findComponentRefInPage` says `Page argument must be an object, not null` for a null page.

For uris, versions and sites without `$` or regular expression characters in them, the answers are the ones 3.x gave.

---

# Utils:

<!-- utils -->
