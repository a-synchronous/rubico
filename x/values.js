const objectValues = require('../_internal/objectValues')

/**
 * @name values
 *
 * @synopsis
 * ```coffeescript [specscript]
 * values<T>(
 *   object String<T>|Array<T>|Set<T>|Map<any=>T>|Object<T>,
 * ) -> Array<T>
 * ```
 *
 * @description
 * Get an array of values from an instance.
 *
 * ```javascript [playground]
 * import values from 'https://unpkg.com/rubico/dist/x/values.es.js'
 *
 * console.log(values({ a: 1, b: 2, c: 3 })) // [1, 2, 3]
 * console.log(values('abc')) // ['a', 'b', 'c']
 * console.log(values(new Map([[1, 'hello'], [2, 'world']]))) // ['hello', 'world']
 * ```
 */
const values = object => object == null ? []
  : typeof object.values == 'function' ? [...object.values()]
  : objectValues(object)

module.exports = values
