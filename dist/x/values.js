/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, values) {
  if (typeof module == 'object') (module.exports = values) // CommonJS
  else if (typeof define == 'function') define(() => values) // AMD
  else (root.values = values) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const objectValues = Object.values

const values = object => object == null ? []
  : typeof object.values == 'function' ? [...object.values()]
  : objectValues(object)

return values
}())))
