'use strict';

const _ = require('lodash'),
  filename = __filename.split('/').pop().split('.').shift(),
  expect = require('chai').expect,
  lib = require('./' + filename),
  bundled = require('./dist'),
  fs = require('fs');


describe(_.startCase(filename), function () {

  it('exports each util in lib', function () {
    fs.readdirSync('./lib')
      .filter(file => fs.statSync('./lib/' + file).isDirectory())
      .forEach((util) => {
        expect(lib[util]).to.eql(require(`./lib/${util}`));
      });
  });

  it('exports each util in bundled', function () {
    fs.readdirSync('./lib')
      .filter(file => fs.statSync('./lib/' + file).isDirectory())
      .forEach((util) => {
        expect(typeof bundled[util]).to.eql(typeof require(`./lib/${util}`));
      });
  });
});
