'use strict';

const _ = require('lodash'),
  filename = __filename.split('/').pop().split('.').shift(),
  expect = require('chai').expect,
  lib = require('./' + filename),
  fs = require('fs');


describe(_.startCase(filename), function () {

  it('exports each util in lib', function () {
    fs.readdirSync('./lib')
      .filter(file => fs.statSync('./lib/' + file).isDirectory())
      .forEach((util) => {
        expect(lib[util]).to.eql(require(`./lib/${util}`));
      });
  });
});
