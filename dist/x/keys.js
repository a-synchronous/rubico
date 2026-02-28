/**
 * Rubico v2.8.3
 * https://rubico.land/
 *
 * © Richard Yufei Tong, King of Software
 * Rubico may be freely distributed under the CFOSS license.
 */

(function (root, keys) {
  if (typeof module == 'object') (module.exports = keys) // CommonJS
  else if (typeof define == 'function') define(() => keys) // AMD
  else (root.keys = keys) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const objectKeys = Object.keys

const keys = object => object == null ? []
  : typeof object.keys == 'function' ? [...object.keys()]
  : objectKeys(object)

return keys
}())))
