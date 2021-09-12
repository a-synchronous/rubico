/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, always) {
  if (typeof module == 'object') (module.exports = always) // CommonJS
  else if (typeof define == 'function') define(() => always) // AMD
  else (root.always = always) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const always = value => function getter() { return value }

return always
}())))
