'use strict';

const name = __filename.split('/').pop().split('.').shift(),
  fn = require('./' + name),
  expect = require('chai').expect;

describe('replaceVersion', () => {
  it('adds version to base', function () {
    expect(fn('domain.com/pages/foo', 'bar')).to.equal('domain.com/pages/foo@bar');
  });

  it('replaces version', function () {
    expect(fn('domain.com/pages/foo@bar', 'baz')).to.equal('domain.com/pages/foo@baz');
  });

  it('removes version', function () {
    expect(fn('domain.com/pages/foo@bar')).to.equal('domain.com/pages/foo');
  });

  it('throws if url is not a string', () => {
    const result = () => fn(1);

    expect(result).to.throw('Argument must be a string, not number');
  });
});
