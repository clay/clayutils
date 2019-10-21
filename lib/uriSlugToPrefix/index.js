'use strict';

const isUriStringCheck = require('../strCheck');

/**
 * Remove the site's slug for the url-patterned prefix
 *
 * @param  {String} uri
 * @param  {Object} site
 * @return {String}
 */
module.exports = function (uri, site) {
  var { slug, prefix, host, path } = site,
    hasSlash = uri.indexOf('/_') !== -1;

  if (!prefix) {
    prefix = path && path.length > 1 ? `${host}${path}` : host;
  }

  isUriStringCheck.strCheck(uri);
  return uri.replace(`${slug}${hasSlash ? '/' : ''}`, `${prefix}${hasSlash ? '/' : ''}`);
};
