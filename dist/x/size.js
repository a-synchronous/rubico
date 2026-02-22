/**
 * Rubico v2.8.2
 * https://rubico.land/
 *
 * © Richard Yufei Tong, King of Software
 * Rubico may be freely distributed under the CFOSS license.
 */

(function (root, size) {
  if (typeof module == 'object') (module.exports = size) // CommonJS
  else if (typeof define == 'function') define(() => size) // AMD
  else (root.size = size) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const objectKeysLength = object => {
  let numKeys = 0
  for (const _ in object) {
    numKeys += 1
  }
  return numKeys
}

const size = value => typeof value == 'string' ? value.length
  : value == null ? 0
  : typeof value.length == 'number' ? value.length
  : typeof value.size == 'number' ? value.size
  : value.constructor == Object ? objectKeysLength(value)
  : 1

return size
}())))
