/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
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
