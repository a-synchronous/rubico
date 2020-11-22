/**
 * @name mapFrom
 *
 * @synopsis
 * ```coffeescript [specscript]
 * mapFrom(object Object) -> Map
 * ```
 *
 * @description
 * Create a new Map from an object.
 */
const mapFrom = object => {
  const result = new Map()
  for (const key in object) {
    result.set(key, object[key])
  }
  return result
}

module.exports = mapFrom
