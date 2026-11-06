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
  isUriStringCheck.strCheck(uri);
  const { host, path, slug, prefix } = site,
    slash = uri.indexOf('/_') !== -1 ? '/' : '',
    from = prefix || (path && path.length > 1 ? `${host}${path}` : host),
    search = `${from}${slash}`,
    replacement = `${slug}${slash}`;

  // the slug goes in as it is: a function keeps replace() from reading `$&` or `$1` in it
  return uri.replace(search, () => replacement);
};
