/**
 * rubico v2.7.7
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2025 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const objectValues = Object.values

const values = object => object == null ? []
  : typeof object.values == 'function' ? [...object.values()]
  : objectValues(object)

export default values
