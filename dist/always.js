/**
 * rubico may be freely distributed under the CFOSS license.
 */

(function (root, always) {
  if (typeof module == 'object') (module.exports = always) // CommonJS
  else if (typeof define == 'function') define(() => always) // AMD
  else (root.always = always) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const always = value => function getter() { return value }

return always
}())))
