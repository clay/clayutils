'use strict';

const isUriStringCheck = require('../strCheck');

/**
 * Remove the url-patterned prefix for the site's slug.
 *
 * @param  {String} uri
 * @param  {Object} site
 * @return {String}
 */
module.exports = function (uri, site) {
  var { host, path, slug } = site;

  isUriStringCheck.strCheck(uri);
  return uri.replace(path && path.length > 1 ? `${host}${path}` : host, slug);
};
