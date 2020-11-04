const objectValues = require('../_internal/objectValues')

/**
 * @name values
 *
 * @synopsis
 * ```coffeescript [specscript]
 * values<T>(object Object<T>) -> Array<T>
 * ```
 *
 * @description
 * Get an array of an object's values.
 *
 * ```javascript [playground]
 * import values from 'https://unpkg.com/rubico/dist/x/values.es.js'
 * ```
 */
const values = object => object == null ? []
  : typeof object.values == 'function' ? [...object.values()]
  : objectValues(object)

module.exports = values
