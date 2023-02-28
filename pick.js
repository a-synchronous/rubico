const getByPath = require('./_internal/getByPath')
const setByPath = require('./_internal/setByPath')

/**
 * @name pick
 *
 * @synopsis
 * ```coffeescript [specscript]
 * pick(keys Array<string>)(object Object) -> result Object
 * ```
 *
 * @description
 * Creates a new object from a source object by selecting provided keys. If a provided key does not exist on the source object, excludes it from the resulting object.
 *
 * ```javascript [playground]
 * console.log(
 *   pick(['hello', 'world'])({ goodbye: 1, world: 2 }),
 * ) // { world: 2 }
 * ```
 *
 * `pick` supports three types of path patterns for nested property access
 *
 *  * dot delimited - `'a.b.c'`
 *  * bracket notation - `'a[0].value'`
 *  * an array of keys or indices - `['a', 0, 'value']`
 *
 * ```javascript [playground]
 * const nested = { a: { b: { c: { d: 1, e: [2, 3] } } } }
 *
 * console.log(pick(['a.b.c.d'])(nested)) // { a: { b: { c: { d: 1 } } } }
 * ```
 */

const pick = keys => function picking(source) {
  if (source == null) {
    return source
  }
  const keysLength = keys.length
  let result = {}
  let keysIndex = -1
  while (++keysIndex < keysLength) {
    const key = keys[keysIndex],
      value = getByPath(source, key)
    if (value != null) {
      result = setByPath(result, value, key)
    }
  }
  return result
}

module.exports = pick
