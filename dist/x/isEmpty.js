/**
 * Rubico v2.8.2
 * https://rubico.land/
 *
 * © Richard Yufei Tong, King of Software
 * Rubico may be freely distributed under the CFOSS license.
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
