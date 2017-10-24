'use strict';

const isUriStringCheck = require('../strCheck');

/**
 * First test if argument passed in is a String. If true, get component name
 * from uri. Otherwise throw an error.
 * @example /components/base  returns base
 * @example /components/text/instances/0  returns text
 * @example /components/image.html  returns image
 * @param  {string} uri
 * @return {string|null}
 */
module.exports = function (uri) {
  isUriStringCheck.strCheck(uri);
  const result = /components\/(.+?)[\/\.]/.exec(uri) || /components\/(.*)/.exec(uri);

  return result && result[1];
};
