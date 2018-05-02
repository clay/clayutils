### isPublished

Check if the uri ends with '@published'

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
