### jsonSlugToPrefix

Update stringified JSON to swap site slug for site prefix for each referenced component's uri. Returns a function which then accepts the stringified JSON. Best when used as the `.then` following a read from the DB before parsing the response.

#### Params

* `site` _object_
* `ref` _boolean_

**Returns** _function_

#### Example

```js
db.get(uri)
  .then(jsonSlugToPrefix(site)) // Assuming '{"layout": "cool/_components/foo", "main": "cool/_components/bad"}',
  .then(JSON.parse)
  ...

//=> '{"layout": "cool.com/ref/path/_components/foo", "main": "cool.com/ref/path/_components/bad"}',

db.get(uri)
  .then(jsonSlugToPrefix(site)) // Assuming '{"child": { "_ref": "cool/_components/foo" }, "prop": "value"}',
  .then(JSON.parse)
  ...

//=> '{"child": { "_ref": "cool.com/ref/path/_components/foo" }, "prop": "value"}',
```
