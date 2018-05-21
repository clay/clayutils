'use strict';

const isUriStringCheck = require('../strCheck');

/**
 * First test if argument is a String. If true, test if '@published' is in the string.
 * Otherwise, throw an error.
 * @param  {string}  uri
 * @return {Boolean}
 */
module.exports = function (uri) {
  isUriStringCheck.strCheck(uri);
  return uri.indexOf('@published') !== -1;
};
