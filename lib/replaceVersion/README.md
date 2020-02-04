### replaceVersion

Replace component version in uri

#### Params

* `uri` _string_
* `version` _string_

**Returns** _string_

#### Example

```js
replaceVersion('nymag.com/press/_components/base/instances/foobarbaz@published', '')
//=> 'nymag.com/press/_components/base/instances/foobarbaz'


replaceVersion('nymag.com/press/_components/base/instances/foobarbaz', 'published')
//=> 'nymag.com/press/_components/base/instances/foobarbaz@published'


```
