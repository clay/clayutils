### uriPrefixToSlug

Replace the site slug with the site's prefix for a given uri

#### Params

* `uri` _string_
* `site` _object_

**Returns** _string_

#### Example

```js
uriPrefixToSlug('domain/_components/foo/instances/foo@published', locals.site);
//=> 'domain.com/path/_components/foo/instances/foo@published'

uriPrefixToSlug('domain/_pages/foo', locals.site);
//=> 'domain.com/path/_pages/foo'

uriPrefixToSlug('domain/_lists/foo', locals.site);
//=> 'domain.com/path/_lists/foo'

uriPrefixToSlug('domain/_uris/foo', locals.site);
//=> 'domain.com/path/_uris/foo'
```
