'use strict';

const isUriStringCheck = require('../strCheck');

/**
 * Given stringified JSON, conver the site's slug
 * to the url-patterned site prefix
 *
 * @param  {Object} site
 * @param  {String} ref
 * @return {Function}
 */
module.exports = function (site, ref = false) {
  return function (json) {
    var slug = site.slug,
      host = site.host,
      path = site.path,
      prefix = site.prefix,
      prefixString, searchString, searchRegex;

    isUriStringCheck.strCheck(json);

    if (!prefix) {
      prefix = path && path.length > 1 ? `${host}${path}` : host;
    }

    prefixString = `${ref ? '"_ref":' : '' }"${prefix}/_components/`;
    searchString = `${ref ? '"_ref":' : '' }"${slug}/_components/`;
    searchRegex = new RegExp(searchString, 'g');
    return json.replace(searchRegex, prefixString);
  };
};
