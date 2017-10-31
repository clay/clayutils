### jsonPrefixToSlug

Update stringified JSON to swap site prefixes for site slugs for each referenced component's uri

#### Params

* `json` _string_
* `site` _object_
* `ref`  _boolean_

**Returns** _string|null_

#### Example

```js
jsonPrefixToSlug(
  '{"layout": "cool.com/ref/path/_components/foo", "main": "cool.com/ref/path/_components/bad"}',
  locals.site
)
//=> '{"layout": "cool/_components/foo", "main": "cool/_components/bad"}'

jsonPrefixToSlug(
  '{"child": { "_ref": "cool.com/ref/path/_components/foo" }, "prop": "value"}',
  locals.site,
  true
)
//=> '{"child": { "_ref": "cool/_components/foo" }, "prop": "value"}'

```
