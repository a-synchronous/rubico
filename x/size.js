const objectKeysLength = require('../_internal/objectKeysLength')

/**
 * @name size
 *
 * @synopsis
 * ```coffeescript [specscript]
 * size(value any) -> number
 * ```
 *
 * @description
 * Get the count of items in a value.
 *
 * ```javascript [playground]
 * import size from 'https://unpkg.com/rubico/dist/x/size.es.js'
 *
 * console.log(size([1, 2, 3])) // 3
 * console.log(size('hey')) // 3
 * console.log(size(new Set([1, 2, 3]))) // 3
 * ```
 */
const size = value => typeof value == 'string' ? value.length
  : value == null ? 0
  : typeof value.length == 'number' ? value.length
  : typeof value.size == 'number' ? value.size
  : value.constructor == Object ? objectKeysLength(value)
  : 1

module.exports = size
