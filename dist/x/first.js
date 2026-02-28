/**
 * Rubico v2.8.3
 * https://rubico.land/
 *
 * © Richard Yufei Tong, King of Software
 * Rubico may be freely distributed under the CFOSS license.
 */

(function (root, first) {
  if (typeof module == 'object') (module.exports = first) // CommonJS
  else if (typeof define == 'function') define(() => first) // AMD
  else (root.first = first) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const first = value => value == null ? undefined : value[0]

return first
}())))
