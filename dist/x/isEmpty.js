/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, isEmpty) {
  if (typeof module == 'object') (module.exports = isEmpty) // CommonJS
  else if (typeof define == 'function') define(() => isEmpty) // AMD
  else (root.isEmpty = isEmpty) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const objectKeysLength = object => {
  let numKeys = 0
  for (const _ in object) {
    numKeys += 1
  }
  return numKeys
}

const isEmpty = value => typeof value == 'string' ? value.length == 0
  : value == null ? true
  : typeof value.length == 'number' ? value.length == 0
  : typeof value.size == 'number' ? value.size == 0
  : value.constructor == Object ? objectKeysLength(value) == 0
  : false

return isEmpty
}())))
