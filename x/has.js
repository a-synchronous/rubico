// (object Object, key string) -> boolean
const objectHas = function (object, key) {
  return object[key] != null
}

/**
 * @name has
 *
 * @synopsis
 * ```coffeescript [specscript]
 * has(key any)(container Set|Map|{ has: function }|Object) -> Promise|boolean
 * ```
 *
 * @description
 * Check if a collection has a key.
 *
 * ```javascript [playground]
 * import has from 'https://unpkg.com/rubico/dist/x/has.es.js'
 *
 * console.log(
 *   has('a')({ a: 1, b: 2, c: 3 }),
 * ) // true
 *
 * console.log(
 *   has('a')({}),
 * ) // false
 * ```
 */
const has = key => function hasKey(container) {
  if (container == null) {
    return false
  }
  if (typeof container.has == 'function') {
    return container.has(key)
  }
  if (container.constructor == Object) {
    return objectHas(container, key)
  }
  return false
}

module.exports = has
