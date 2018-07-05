### getPageInstance

Get page instance from uri

#### Params

* `uri` _string_

**Returns** _string|null_

#### Example

```js
getPageInstance('nymag.com/scienceofus/_pages/foobarbaz')
//=> 'foobarbaz'

getPageInstance('nymag.com/scienceofus/_pages/foobar-baz/meta')
//=> 'foobar-baz'

getPageInstance('nymag.com/scienceofus/_pages/foobarbaz@published')
//=> 'foobarbaz@published'
```
