/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
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
