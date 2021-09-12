/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, prepend) {
  if (typeof module == 'object') (module.exports = prepend) // CommonJS
  else if (typeof define == 'function') define(() => prepend) // AMD
  else (root.prepend = prepend) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const isString = function (value) {
  return typeof value == 'string'
    || (value != null && value.constructor == String)
}

const isArray = Array.isArray

const prepend = item => function prependFunc(value) {

    if (isArray(value)) {
      if (isArray(item)){
        return [...item, ...value]
      }
      return [item, ...value]
    }

    if (isString(value)){
      if (!isString(item)){
        throw new TypeError(`${item} is not a string`)
      }
      return `${item}${value}`
    }

    throw new TypeError(`${value} is not an Array or string`)
  }

return prepend
}())))
