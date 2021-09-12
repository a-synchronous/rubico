/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, first) {
  if (typeof module == 'object') (module.exports = first) // CommonJS
  else if (typeof define == 'function') define(() => first) // AMD
  else (root.first = first) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const first = value => value == null ? undefined : value[0]

return first
}())))
