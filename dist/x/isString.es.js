/**
 * Rubico v2.8.2
 * https://rubico.land/
 *
 * © Richard Yufei Tong, King of Software
 * Rubico may be freely distributed under the CFOSS license.
 */

const isString = function (value) {
  return typeof value == 'string'
    || (value != null && value.constructor == String)
}

export default isString
