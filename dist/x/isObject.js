/**
 * rubico v1.6.9
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2020 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, isObject) {
  if (typeof module == 'object') (module.exports = isObject) // CommonJS
  else if (typeof define == 'function') define(() => isObject) // AMD
  else (root.isObject = isObject) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const isObject = value => value != null && value.constructor == Object

return isObject
}())))
