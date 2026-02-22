/**
 * Rubico v2.8.2
 * https://rubico.land/
 *
 * © Richard Yufei Tong, King of Software
 * Rubico may be freely distributed under the CFOSS license.
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
