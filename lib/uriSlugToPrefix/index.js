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
  isUriStringCheck.strCheck(uri);
  const { slug, prefix, host, path } = site,
    slash = uri.indexOf('/_') !== -1 ? '/' : '',
    to = prefix || (path && path.length > 1 ? `${host}${path}` : host),
    search = `${slug}${slash}`,
    replacement = `${to}${slash}`;

  // the prefix goes in as it is: a function keeps replace() from reading `$&` or `$1` in it
  return uri.replace(search, () => replacement);
};
