const getByPath = require('./_internal/getByPath')
const setByPath = require('./_internal/setByPath')

/**
 * @name pick
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var keys Array<string>,
 *   source Object
 *
 * pick(keys)(source) -> picked Object
 * ```
 *
 * @description
 * Create a new object by including specific keys.
 *
 * ```javascript [playground]
 * console.log(
 *   pick(['hello', 'world'])({ goodbye: 1, world: 2 }),
 * ) // { world: 2 }
 *
 * console.log(
 *   pick(['a.b.c.d'])({ a: { b: { c: { d: 1, e: [2, 3] } } } }),
 * ) // { a: { b: { c: { d: 1 } } } }
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
