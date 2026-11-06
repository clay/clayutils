'use strict';

const isUriStringCheck = require('../strCheck'),
  // finds what lower-casing the uri and looking for '/_pages/' finds (compared on every Unicode character)
  pages = /\/_pages\//i;

/**
 * First test if argument is a String. If true, test if '/_pages/' is in the string.
 * Otherwise, throw an error.
 * @param  {string}  uri
 * @return {Boolean}
 */
module.exports = function (uri) {
  isUriStringCheck.strCheck(uri);
  return pages.test(uri);
};
