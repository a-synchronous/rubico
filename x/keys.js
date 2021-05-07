const objectKeys = require('../_internal/objectKeys')

/**
 * @name keys
 *
 * @synopsis
 * ```coffeescript [specscript]
 * keys(value string|Array|Set|Map|object) -> Array<key number|string>
 * ```
 *
 * @description
 * Get an array of keys from an instance.
 *
 * ```javascript [playground]
 * import keys from 'https://unpkg.com/rubico/dist/x/keys.es.js'
 *
 * console.log(keys({ a: 1, b: 2, c: 3 })) // ['a', 'b', 'c']
 * console.log(keys(['hello', 'world'])) // [0, 1]
 * console.log(keys(new Map([['hello', 1], ['world', 2]]))) // ['hello', 'world']
 * ```
 *
 * @since 1.6.25
 */
const keys = object => object == null ? []
  : typeof object.keys == 'function' ? [...object.keys()]
  : objectKeys(object)

module.exports = keys
