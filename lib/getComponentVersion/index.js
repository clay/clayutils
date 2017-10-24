'use strict';

const isUriStringCheck = require('../strCheck');

/**
 * First test if the argument passed in is a String. If true, get component version from uri.
 * Otherwise throw an error.
 * @example /components/foo/instances/bar@published returns published
 * @param  {string} uri
 * @return {string|null}
 */
module.exports = function (uri) {
  isUriStringCheck.strCheck(uri);
  const result = /\/components\/.+?@(.+)/.exec(uri);

  return result && result[1];
};
