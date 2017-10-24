'use strict';

/**
 * Return true if argument passed in is a string. If not, throw an error.
 * strCheck is used in each util function to check if the URI passed in is a string.
 *
 * @param  {string} arg
 * @return {boolean|error}
 */
function strCheck(arg) {
  if (typeof arg === 'string') {
    return true;
  } else {
    throw new Error('Argument must be a string, not ' + typeof arg);
  }
}

module.exports.strCheck = strCheck;
