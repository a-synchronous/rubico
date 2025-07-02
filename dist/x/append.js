/**
 * rubico v2.7.5
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2025 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, append) {
  if (typeof module == 'object') (module.exports = append) // CommonJS
  else if (typeof define == 'function') define(() => append) // AMD
  else (root.append = append) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const isString = function (value) {
  return typeof value == 'string'
    || (value != null && value.constructor == String)
}

const isArray = Array.isArray

const append = element => function appendFunc(value) {

    if (isArray(value)) {
      if (isArray(element)){
        return [...value, ...element]
      }
      return [...value, element]
    }

    if (isString(value)){
      if (!isString(element)){
        throw new TypeError(`${element} is not a string`)
      }
      return `${value}${element}`
    }

    throw new TypeError(`${value} is not an Array or string`)
  }

return append
}())))
