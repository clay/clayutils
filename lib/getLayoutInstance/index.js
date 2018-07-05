'use strict';

const isUriStringCheck = require('../strCheck');

/**
 * First test if argument passed in is a String. If true, get layout instance
 * from uri without the layout version. Otherwise, throw an error.
 * @example /_layouts/text/instances/0@published returns 0
 * @param  {string} uri
 * @return {string|null}
 */
module.exports = function (uri) {
  isUriStringCheck.strCheck(uri);
  const result = /\/_layouts\/.+?\/instances\/([^\.\/@]+)/.exec(uri);

  return result && result[1];
};
