/**
 * rubico v2.6.6
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2025 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const isString = function (value) {
  return typeof value == 'string'
    || (value != null && value.constructor == String)
}

export default isString
