const isArray = require('../_internal/isArray')

/**
 * @name arrayDefaultsDeepFromArray
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var array Array<Array|Object|any>,
 *   defaultArray Array<Array|Object|any>,
 *
 * arrayDefaultsDeepFromArray(array, defaultArray) -> Array
 * ```
 */
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

/**
 * @name objectDefaultsDeepFromObject
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var object Object<Array|Object|any>,
 *   defaultObject Object<Array|Object|any>
 *
 * objectDefaultsDeepFromObject(object, defaultObject) -> Object
 * ```
 */
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

/**
 * @name defaultsDeep
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var defaultCollection Array|Object,
 *   value Array|Object
 *
 * defaultsDeep(defaultCollection)(value) -> Array|Object
 * ```
 *
 * @description
 * Deeply assign default values to an array or object by an array or object of possibly nested default values.
 *
 * ```javascript [playground]
 * import defaultsDeep from 'https://unpkg.com/rubico/dist/x/defaultsDeep.es.js'
 *
 * const defaultUser = defaultsDeep({
 *   name: 'placeholder',
 *   images: [
 *     { url: 'https://via.placeholder.com/150' },
 *     { url: 'https://via.placeholder.com/150' },
 *     { url: 'https://via.placeholder.com/150' },
 *   ],
 * })
 *
 * console.log(defaultUser({
 *   name: 'George',
 *   images: [{ url: 'https://via.placeholder.com/150/0000FF/808080%20?Text=Digital.com' }],
 * }))
 * // {
 * //   name: 'George',
 * //   images: [
 * //    { url: 'https://via.placeholder.com/150/0000FF/808080%20?Text=Digital.com' },
 * //    { url: 'https://via.placeholder.com/150' },
 * //    { url: 'https://via.placeholder.com/150' },
 * //   ],
 * // }
 * ```
 */
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

module.exports = defaultsDeep
