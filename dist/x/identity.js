/**
 * Rubico v2.8.2
 * https://rubico.land/
 *
 * © Richard Yufei Tong, King of Software
 * Rubico may be freely distributed under the CFOSS license.
 */

(function (root, identity) {
  if (typeof module == 'object') (module.exports = identity) // CommonJS
  else if (typeof define == 'function') define(() => identity) // AMD
  else (root.identity = identity) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const identity = value => value

return identity
}())))
