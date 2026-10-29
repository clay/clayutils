'use strict';

const isUriStringCheck = require('../strCheck');

/**
 * replace version in uri
 * @param  {string} uri
 * @param  {string} [version] defaults to latest
 * @return {string}
 */
module.exports = function (uri, version) {
  isUriStringCheck.strCheck(uri);
  const at = uri.indexOf('@'),
    unversioned = at === -1 ? uri : uri.slice(0, at);

  if (version) {
    return unversioned + '@' + version;
  } else {
    // no version is still a kind of version
    return unversioned;
  }
};
