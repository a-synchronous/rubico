/**
 * Rubico v2.8.3
 * https://rubico.land/
 *
 * © Richard Yufei Tong, King of Software
 * Rubico may be freely distributed under the CFOSS license.
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
