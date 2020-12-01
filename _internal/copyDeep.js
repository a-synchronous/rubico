const isArray = require('./isArray')

// objectCopyDeep(array Array) -> copied Array
const objectCopyDeep = function (object) {
  const result = {}
  for (const key in object) {
    const item = object[key]
    if (isArray(item)) {
      result[key] = arrayCopyDeep(item)
    } else if (item != null && item.constructor == Object) {
      result[key] = objectCopyDeep(item)
    } else {
      result[key] = item
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
    const item = array[index]
    if (isArray(item)) {
      result[index] = arrayCopyDeep(item)
    } else if (item != null && item.constructor == Object) {
      result[index] = objectCopyDeep(item)
    } else {
      result[index] = item
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
