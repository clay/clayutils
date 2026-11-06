'use strict';

const isUriStringCheck = require('../strCheck'),
  // finds what lower-casing the uri and looking for '/_lists/' finds (compared on every Unicode character)
  lists = /\/_lists\//i;

/**
 * First test if argument is a String. If true, test if '/_lists/' is in the string.
 * Otherwise, throw an error.
 * @param  {string}  uri
 * @return {Boolean}
 */
module.exports = function (uri) {
  isUriStringCheck.strCheck(uri);

  return lists.test(uri);
};
