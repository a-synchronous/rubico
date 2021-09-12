/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, last) {
  if (typeof module == 'object') (module.exports = last) // CommonJS
  else if (typeof define == 'function') define(() => last) // AMD
  else (root.last = last) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const last = value => {
  if (value == null) {
    return undefined
  }
  const length = value.length
  return typeof length == 'number' ? value[length - 1] : undefined
}

return last
}())))
