/**
 * Rubico v2.8.2
 * https://rubico.land/
 *
 * © Richard Yufei Tong, King of Software
 * Rubico may be freely distributed under the CFOSS license.
 */

(function (root, isFunction) {
  if (typeof module == 'object') (module.exports = isFunction) // CommonJS
  else if (typeof define == 'function') define(() => isFunction) // AMD
  else (root.isFunction = isFunction) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const isFunction = value => typeof value == 'function'

return isFunction
}())))
