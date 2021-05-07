const objectKeys = require('../_internal/objectKeys')

/**
 * @name keys
 *
 * @synopsis
 * ```coffeescript [specscript]
 * keys<T>(
 *   mapLike String<T>|Array<T>|Set<T>|Map<any=>T>|Object<T>,
 * ) -> Array<T>
 * ```
 *
 * @description
 * Get an array of keys from an instance.
 *
 * ```javascript [playground]
 * import keys from 'https://unpkg.com/rubico/dist/x/keys.es.js'
 *
 * console.log(keys({ a: 1, b: 2, c: 3 })) // ['a', 'b', 'c']
 * console.log(keys('abc')) // [0, 1, 2]
 * console.log(keys(new Map([['hello', 1], ['world', 2]]))) // ['hello', 'world']
 * ```
 *
 * @since 1.6.25
 */
const keys = object => object == null ? []
  : typeof object.keys == 'function' ? [...object.keys()]
  : objectKeys(object)

module.exports = keys
