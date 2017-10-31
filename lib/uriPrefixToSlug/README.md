### uriPrefixToSlug

Replace the site prefix with the site's slug for a given uri

#### Params

* `uri` _string_
* `site` _object_

**Returns** _string_

#### Example

```js
uriPrefixToSlug('domain.com/path/_components/foo/instances/foo@published', locals.site);
//=> 'domain/_components/foo/instances/foo@published'

uriPrefixToSlug('domain.com/path/_pages/foo', locals.site);
//=> 'domain/_pages/foo'

uriPrefixToSlug('domain.com/path/_lists/foo', locals.site);
//=> 'domain/_lists/foo'

uriPrefixToSlug('domain.com/path/_uris/foo', locals.site);
//=> 'domain/_uris/foo'
```
