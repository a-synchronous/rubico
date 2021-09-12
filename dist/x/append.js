/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
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

const append = item => function appendFunc(value) {

    if (isArray(value)) {
      if (isArray(item)){
        return [...value, ...item]
      }
      return [...value, item]
    }

    if (isString(value)){
      if (!isString(item)){
        throw new TypeError(`${item} is not a string`)
      }
      return `${value}${item}`
    }

    throw new TypeError(`${value} is not an Array or string`)
  }

return append
}())))
