'use strict';

const isUriStringCheck = require('../strCheck');

/**
 * First test if argument passed in is a String. If true, get page instance
 * from uri that includes page version. Otherwise, throw an error.
 * @example /pages/cj21ud3rt00wmqpyefc944hez@published returns cj21ud3rt00wmqpyefc944hez@published
 * @param  {string} uri
 * @return {string|null}
 */
module.exports = function (uri) {
  isUriStringCheck.strCheck(uri);
  const result = /\/pages\/(.*)/.exec(uri);

  return result && result[1];
};
