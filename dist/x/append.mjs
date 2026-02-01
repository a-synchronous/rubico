/**
 * rubico v2.7.9
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2026 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

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

export default append
