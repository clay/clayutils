'use strict';

const { describe, it } = require('node:test'),
  assert = require('node:assert/strict'),
  fs = require('node:fs'),
  path = require('node:path'),
  lib = require('./index'),
  utils = fs.readdirSync(path.join(__dirname, 'lib'), { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();

describe('index', () => {
  it('exports every util in lib, and nothing else', () => {
    assert.deepEqual(Object.keys(lib).sort(), utils);
  });

  it('exports the function of each util', () => {
    utils.forEach((util) => {
      assert.equal(lib[util], require(`./lib/${util}`));
    });
  });
});
