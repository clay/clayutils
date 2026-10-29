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
  isUriStringCheck.strCheck(json);
  const { slug, host, path, prefix } = site,
    key = ref ? '"_ref":' : '',
    from = prefix || (path && path.length > 1 ? `${host}${path}` : host),
    search = `${key}"${from}/_components/`,
    replacement = `${key}"${slug}/_components/`;

  // the prefix is looked for as the text it is, and the slug goes in as it is
  return json.split(search).join(replacement);
};
