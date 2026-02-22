/**
 * Rubico v2.8.1
 * https://rubico.land/
 *
 * © Richard Yufei Tong, King of Software
 * Rubico may be freely distributed under the CFOSS license.
 */

const isString = function (value) {
  return typeof value == 'string'
    || (value != null && value.constructor == String)
}

const isArray = Array.isArray

const prepend = element => function prependFunc(value) {

    if (isArray(value)) {
      if (isArray(element)){
        return [...element, ...value]
      }
      return [element, ...value]
    }

    if (isString(value)){
      if (!isString(element)){
        throw new TypeError(`${element} is not a string`)
      }
      return `${element}${value}`
    }

    throw new TypeError(`${value} is not an Array or string`)
  }

export default prepend
