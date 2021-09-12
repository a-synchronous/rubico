/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, defaultsDeep) {
  if (typeof module == 'object') (module.exports = defaultsDeep) // CommonJS
  else if (typeof define == 'function') define(() => defaultsDeep) // AMD
  else (root.defaultsDeep = defaultsDeep) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const isArray = Array.isArray

const arrayDefaultsDeepFromArray = function (array, defaultArray) {
  const defaultArrayLength = defaultArray.length,
    result = array.slice()
  let index = -1
  while (++index < defaultArrayLength) {
    const item = array[index],
      defaultItem = defaultArray[index]
    if (isArray(item) && isArray(defaultItem)) {
      result[index] = arrayDefaultsDeepFromArray(item, defaultItem)
    } else if (item == null) {
      result[index] = defaultItem
    } else if (defaultItem == null) {
      result[index] = item
    } else if (item.constructor == Object && defaultItem.constructor == Object) {
      result[index] = objectDefaultsDeepFromObject(item, defaultItem)
    } else {
      result[index] = item
    }
  }
  return result
}

const objectDefaultsDeepFromObject = function (object, defaultObject) {
  const result = { ...object }
  for (const key in defaultObject) {
    const item = object[key],
      defaultItem = defaultObject[key]
    if (isArray(item) && isArray(defaultItem)) {
      result[key] = arrayDefaultsDeepFromArray(item, defaultItem)
    } else if (item == null) {
      result[key] = defaultItem
    } else if (defaultItem == null) {
      result[key] = item
    } else if (item.constructor == Object && defaultItem.constructor == Object) {
      result[key] = objectDefaultsDeepFromObject(item, defaultItem)
    } else {
      result[key] = item
    }
  }
  return result
}

const defaultsDeep = defaultCollection => function defaulting(value) {
  if (isArray(value) && isArray(defaultCollection)) {
    return arrayDefaultsDeepFromArray(value, defaultCollection)
  }
  if (value == null || defaultCollection == null) {
    return value
  }
  if (value.constructor == Object && defaultCollection.constructor == Object) {
    return objectDefaultsDeepFromObject(value, defaultCollection)
  }
  return value
}

return defaultsDeep
}())))
