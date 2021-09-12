/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, isString) {
  if (typeof module == 'object') (module.exports = isString) // CommonJS
  else if (typeof define == 'function') define(() => isString) // AMD
  else (root.isString = isString) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const isString = function (value) {
  return typeof value == 'string'
    || (value != null && value.constructor == String)
}

return isString
}())))
