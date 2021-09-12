/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const isArray = Array.isArray

const sameValueZero = function (left, right) {
  return left === right || (left !== left && right !== right)
}

// (object Object, value any) -> boolean
const objectIncludes = function (object, value) {
  for (const key in object) {
    if (sameValueZero(value, object[key])) {
      return true
    }
  }
  return false
}

const includes = value => function includesValue(container) {
  if (container == null) {
    return false
  }
  if (typeof container.includes == 'function') {
    return container.includes(value)
  }
  if (container.constructor == Object) {
    return objectIncludes(container, value)
  }
  return false
}

export default includes
