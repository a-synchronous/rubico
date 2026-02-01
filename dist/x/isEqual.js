/**
 * rubico v2.7.9
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2026 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, isEqual) {
  if (typeof module == 'object') (module.exports = isEqual) // CommonJS
  else if (typeof define == 'function') define(() => isEqual) // AMD
  else (root.isEqual = isEqual) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'
const isEqual = (a, b) => a === b

return isEqual
}())))
