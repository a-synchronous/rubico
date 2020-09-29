/**
 * @name pick
 *
 * @synopsis
 * ```coffeescript [specscript]
 * pick<
 *   keys Array<string>,
 *   source Object,
 * >(keys)(source) -> picked Object
 * ```
 *
 * @description
 * Create a new object by including specific keys.
 *
 * ```javascript [playground]
 * console.log(
 *   pick(['hello', 'world'])({ goodbye: 1, world: 2 }),
 * ) // { world: 2 }
 * ```
 */
const pick = keys => function picking(source) {
  if (source == null) {
    return source
  }
  const keysLength = keys.length,
    result = {}
  let keysIndex = -1
  while (++keysIndex < keysLength) {
    const key = keys[keysIndex],
      value = source[key]
    if (value != null) {
      result[key] = value
    }
  }
  return result
}

module.exports = pick
