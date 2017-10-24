'use strict';

const name = __filename.split('/').pop().split('.').shift(),
  fn = require('./' + name),
  expect = require('chai').expect;

describe('getComponentName', () => {
  it('gets name from default uri', function () {
    expect(fn('/components/base')).to.equal('base');
  });

  it('gets name from instance uri', function () {
    expect(fn('/components/base/instances/0')).to.equal('base');
  });

  it('gets name from versioned uri', function () {
    expect(fn('/components/base/instances/0@published')).to.equal('base');
  });

  it('gets name from uri with extension', function () {
    expect(fn('/components/base.html')).to.equal('base');
    expect(fn('/components/base.json')).to.equal('base');
  });

  it('gets name from full uri', function () {
    expect(fn('nymag.com/press/components/base/instances/foobarbaz@published')).to.equal('base');
  });

  it('throws an error if argument passed in is not a String', () => {
    const nonStringArgument = function () {
      return fn([1, 2, 3, 4]);
    };

    expect(nonStringArgument).to.throw(Error);
  });
});
