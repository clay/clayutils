'use strict';

const isUriStringCheck = require('../strCheck');

/**
 * Given stringified JSON, swap out the site's url-patterned prefix for
 * the site's slug
 *
 * @param  {String}  json
 * @param  {Object}  site
 * @param  {Boolean} [ref=false]
 * @return {String}
 */
module.exports = function (json, site, ref = false) {
  var { slug, host, path, prefix } = site,
    sitePrefix, prefixString, replaceString, searchRegex;

  isUriStringCheck.strCheck(json);

  sitePrefix = prefix || path && path.length > 1 ? `${host}${path}` : host;
  prefixString = `${ref ? '"_ref":' : '' }"${sitePrefix}/_components/`;
  replaceString = `${ref ? '"_ref":' : '' }"${slug}/_components/`;
  searchRegex = new RegExp(prefixString, 'g');
  return json.replace(searchRegex, replaceString);
};
