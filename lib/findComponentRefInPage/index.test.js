'use strict';

const name = __filename.split('/').pop().split('.').shift(),
  fn = require('./' + name),
  expect = require('chai').expect,
  page = {
    head: [
      'www.site.com/_components/clay-meta-title/instances/cjge4wmjo010uhfy6wtd23r99',
      'www.site.com/_components/clay-meta-url/instances/cjge4wmjo010vhfy6t3wdq479',
      'www.site.com/_components/clay-meta-description/instances/cjge4wmjp010whfy6qb4ufmhr',
      'www.site.com/_components/meta-image/instances/cjge4wmjp010xhfy6a943zfu1',
      'www.site.com/_components/clay-meta-keywords/instances/cjge4wmjs010yhfy6fkyka6yg',
      'www.site.com/_components/meta-authors/instances/cjge4wmjt010zhfy61g45ekip',
      'www.site.com/_components/amp-relay/instances/cjge4wmju0110hfy6n1eulz68'
    ],
    main: [
      'www.site.com/_components/lede-gallery/instances/cjge4wmk0011ahfy62gey95wi',
      'www.site.com/_components/circulation/instances/cjge4wmjn010thfy6ug8ktg5b'
    ],
    layout: 'www.site.com/_layouts/layout/instances/gallery'
  };

describe('findComponentRefInPage', () => {
  it('Finds a type of component in page data', () => {
    expect(fn(page, 'amp-relay')).to.equal('www.site.com/_components/amp-relay/instances/cjge4wmju0110hfy6n1eulz68');
  });

  it('Returns undefined if the component was not found', () => {
    expect(fn(page, 'clay-paragraph')).to.equal(undefined);
  });

  it('throws an error if componentName passed in is not a String', () => {
    const nonObjArgument = function () {
      return fn('string', 'string');
    };

    expect(nonObjArgument).to.throw(Error);
  });

  it('throws an error if componentName passed in is not a String', () => {
    const nonStringArgument = function () {
      return fn({}, [1, 2, 3, 4]);
    };

    expect(nonStringArgument).to.throw(Error);
  });
});
