/**
 * Rubico v2.8.1
 * https://rubico.land/
 *
 * © Richard Yufei Tong, King of Software
 * Rubico may be freely distributed under the CFOSS license.
 */

(function (root, noop) {
  if (typeof module == 'object') (module.exports = noop) // CommonJS
  else if (typeof define == 'function') define(() => noop) // AMD
  else (root.noop = noop) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const noop = function noop() {}

return noop
}())))
