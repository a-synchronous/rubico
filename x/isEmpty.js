const objectKeysLength = require('../_internal/objectKeysLength')

/**
 * @name isEmpty
 *
 * @synopsis
 * ```coffeescript [specscript]
 * isEmpty(value any) -> boolean
 * ```
 *
 * @description
 * Check if a value is empty.
 *
 * ```javascript [node]
 * console.log(isEmpty('')) // true
 * console.log(isEmpty([])) // true
 * console.log(isEmpty(new Set())) // true
 * console.log(isEmpty(new Map())) // true
 * console.log(isEmpty({})) // true
 * console.log(isEmpty('hey')) // false
 * console.log(isEmpty([1, 2, 3])) // false
 * console.log(isEmpty(new Set([1, 2, 3]))) // false
 * console.log(isEmpty(new Map([['a', 1], ['b', 2], ['c', 3]]))) // false
 * console.log(isEmpty({ a: 1, b: 2, c: 3 })) // false
 * console.log(isEmpty(100)) // false
 * ```
 */
const isEmpty = value => typeof value == 'string' ? value.length == 0
  : value == null ? true
  : typeof value.length == 'number' ? value.length == 0
  : typeof value.size == 'number' ? value.size == 0
  : value.constructor == Object ? objectKeysLength(value) == 0
  : false

module.exports = isEmpty
