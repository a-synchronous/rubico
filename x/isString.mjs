/**
 * rubico may be freely distributed under the CFOSS license.
 */

const isString = function (value) {
  return typeof value == 'string'
    || (value != null && value.constructor == String)
}

export default isString
