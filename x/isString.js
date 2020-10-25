/**
 * @name isString
 *
 * @synopsis
 * ```coffeescript [specscript]
 * isString(value any) -> boolean
 * ```
 *
 * @description
 * Determine whether a value is a string.
 *
 * ```javascript [playground]
 * import isString from 'https://unpkg.com/rubico/dist/x/isString.es.js'
 *
 * console.log(
 *   isString('hey'),
 * ) // true
 * ```
 */
const isString = function (value) {
  return typeof value == 'string'
    || (value != null && value.constructor == String)
}

module.exports = isString
