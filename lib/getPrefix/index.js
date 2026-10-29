'use strict';

const isUriStringCheck = require('../strCheck'),
  // the first of these is where the prefix ends
  siteParts = /\/_(pages|components|lists|uris|schedule|users|layouts|sites)/;

/**
 * Return the site prefix from the URI.
 * @param  {string}  uri
 * @return {string}
 */
module.exports = function (uri) {
  isUriStringCheck.strCheck(uri);
  const end = uri.search(siteParts);

  return end === -1 ? uri : uri.slice(0, end);
};
