'use strict';

const isUriStringCheck = require('../strCheck'),
  validationRegex = /.+@published$/;

/**
 * First test if argument is a String. If true, test if the string ends with '@published'.
 * Otherwise, throw an error.
 * @param  {string}  uri
 * @return {Boolean}
 */
module.exports = function (uri) {
  isUriStringCheck.strCheck(uri);
  return validationRegex.test(uri);
};
