'use strict';

const isUriStringCheck = require('../strCheck'),
  // finds what lower-casing the uri and looking for '/_components/' finds (compared on every Unicode character)
  components = /\/_components\//i;

/**
 * First test if argument is a String. If true, test if '/_components/' is in the string.
 * Otherwise, throw an error.
 * @param  {string}  uri
 * @return {Boolean}
 */
module.exports = function (uri) {
  isUriStringCheck.strCheck(uri);
  return components.test(uri);
};
