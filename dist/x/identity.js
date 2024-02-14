/**
 * rubico v2.3.2
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2024 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, identity) {
  if (typeof module == 'object') (module.exports = identity) // CommonJS
  else if (typeof define == 'function') define(() => identity) // AMD
  else (root.identity = identity) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const identity = value => value

return identity
}())))
