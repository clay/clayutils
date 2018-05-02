### isPublished

Check if '@published' is in the uri

#### Params

* `uri` _string_

**Returns** _boolean_

#### Example

```js
isPublished('nymag.com/press/_components/base/instances/foobarbaz@published')
//=> true

isPublished('nymag.com/press/_components/base/instances/foobarbaz')
//=> false

```
