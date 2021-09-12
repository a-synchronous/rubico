/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
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
