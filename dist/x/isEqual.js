/**
 * Rubico v2.8.3
 * https://rubico.land/
 *
 * © Richard Yufei Tong, King of Software
 * Rubico may be freely distributed under the CFOSS license.
 */

(function (root, isEqual) {
  if (typeof module == 'object') (module.exports = isEqual) // CommonJS
  else if (typeof define == 'function') define(() => isEqual) // AMD
  else (root.isEqual = isEqual) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'
const isEqual = (a, b) => a === b

return isEqual
}())))
