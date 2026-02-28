/**
 * Rubico v2.8.3
 * https://rubico.land/
 *
 * © Richard Yufei Tong, King of Software
 * Rubico may be freely distributed under the CFOSS license.
 */

(function (root, isObject) {
  if (typeof module == 'object') (module.exports = isObject) // CommonJS
  else if (typeof define == 'function') define(() => isObject) // AMD
  else (root.isObject = isObject) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const isObject = value => {
  if (value == null) {
    return false
  }

  const typeofValue = typeof value
  return (typeofValue == 'object') || (typeofValue == 'function')
}

return isObject
}())))
