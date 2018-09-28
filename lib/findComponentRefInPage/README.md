### findComponentRefInPage

Returns the first URI of a type of component found in a page data object. Note: this will only work for _unresolved_ page data.

#### Params

* `page` _object_
* `componentName` _string_

**Returns** _string|undefined_

#### Example

```js
const page = {
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

findComponentRefInPage(page, 'meta-authors')
//=> 'www.site.com/_components/meta-authors/instances/cjge4wmjt010zhfy61g45ekip'

```
