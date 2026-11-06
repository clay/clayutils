'use strict';

const getComponentName = require('../getComponentName'),
  { strCheck } = require('../strCheck');

module.exports = (page, componentName) => {
  strCheck(componentName);

  if (page === null || typeof page !== 'object') {
    throw new Error(`Page argument must be an object, not ${page === null ? 'null' : typeof page}`);
  }

  return Object.values(page).filter(Array.isArray).reduce((acc, val) => acc.concat(val), []).find(cmpt => getComponentName(cmpt) === componentName);
};
