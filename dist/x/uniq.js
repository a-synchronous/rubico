/**
 * rubico v2.7.9
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2026 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, uniq) {
  if (typeof module == 'object') (module.exports = uniq) // CommonJS
  else if (typeof define == 'function') define(() => uniq) // AMD
  else (root.uniq = uniq) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const isArray = Array.isArray

const uniq = arr => {
  if (!isArray(arr)) throw Error('uniq(arr): arr is not an array')
  return [...new Set(arr)]
}

return uniq
}())))
