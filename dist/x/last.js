/**
 * Rubico v2.8.1
 * https://rubico.land/
 *
 * © Richard Yufei Tong, King of Software
 * Rubico may be freely distributed under the CFOSS license.
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
