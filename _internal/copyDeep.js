const isArray = require('./isArray')

// objectCopyDeep(array Array) -> copied Array
const objectCopyDeep = function (object) {
  const result = {}
  for (const key in object) {
    const element = object[key]
    if (isArray(element)) {
      result[key] = arrayCopyDeep(element)
    } else if (element != null && element.constructor == Object) {
      result[key] = objectCopyDeep(element)
    } else {
      result[key] = element
    }
  }
  return result
}

// arrayCopyDeep(array Array) -> copied Array
const arrayCopyDeep = function (array) {
  const length = array.length,
    result = []
  let index = -1
  while (++index < length) {
    const element = array[index]
    if (isArray(element)) {
      result[index] = arrayCopyDeep(element)
    } else if (element != null && element.constructor == Object) {
      result[index] = objectCopyDeep(element)
    } else {
      result[index] = element
    }
  }
  return result
}

/**
 * @name copyDeep
 *
 * @synopsis
 * ```coffeescript [specscript]
 * copyDeep(value Array|Object) -> deepCopy Array|Object
 * ```
 *
 * @catchphrase
 * Deep copy objects or arrays.
 */
const copyDeep = function (value) {
  if (isArray(value)) {
    return arrayCopyDeep(value)
  }
  if (value == null) {
    return value
  }
  if (value.constructor == Object) {
    return objectCopyDeep(value)
  }
  return value
}

module.exports = copyDeep
