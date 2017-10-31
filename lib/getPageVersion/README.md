### getPageVersion

Get page version from uri

#### Params

* `uri` _string_

**Returns** _string|null_

#### Example

```js
getPageVersion('nymag.com/press/_pages/foo@published')
//=> 'published'

getPageVersion('nymag.com/press/_pages/foo')
//=> null
```
