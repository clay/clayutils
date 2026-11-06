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
    isUriStringCheck.strCheck(json);
    const { slug, host, path, prefix } = site,
      key = ref ? '"_ref":' : '',
      to = prefix || (path && path.length > 1 ? `${host}${path}` : host),
      search = `${key}"${slug}/_components/`,
      replacement = `${key}"${to}/_components/`;

    // the slug is looked for as the text it is, and the prefix goes in as it is
    return json.split(search).join(replacement);
  };
};
