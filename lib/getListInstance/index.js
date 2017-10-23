'use strict';

const isUriStringCheck = require('../strCheck');

/**
 * First test if argument passed in is a String. If true, get list instance
 * from URI. Otherwise, throw an error.
 * @example /lists/foo returns "foo"
 * @param  {string} uri
 * @return {string|null}
 */
module.exports = function (uri) {
  isUriStringCheck.strCheck(uri);
  const result = /\/lists\/(.*)/.exec(uri);

  return result && result[1];
};
