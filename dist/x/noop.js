/**
 * rubico v2.6.6
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2025 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, noop) {
  if (typeof module == 'object') (module.exports = noop) // CommonJS
  else if (typeof define == 'function') define(() => noop) // AMD
  else (root.noop = noop) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const noop = function noop() {}

return noop
}())))
