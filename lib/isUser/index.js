'use strict';

const isUriStringCheck = require('../strCheck'),
  // finds what lower-casing the uri and looking for '/_users/' finds (compared on every Unicode character)
  users = /\/_users\//i;

/**
 * First test if argument is a String. If true, test if '/_users/' is in the string.
 * Otherwise, throw an error.
 * @param  {string}  uri
 * @return {Boolean}
 */
module.exports = function (uri) {
  isUriStringCheck.strCheck(uri);

  return users.test(uri);
};
