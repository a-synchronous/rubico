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
    const element = array[index],
      defaultElement = defaultArray[index]
    if (isArray(element) && isArray(defaultElement)) {
      result[index] = arrayDefaultsDeepFromArray(element, defaultElement)
    } else if (element == null) {
      result[index] = defaultElement
    } else if (defaultElement == null) {
      result[index] = element
    } else if (element.constructor == Object && defaultElement.constructor == Object) {
      result[index] = objectDefaultsDeepFromObject(element, defaultElement)
    } else {
      result[index] = element
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
    const element = object[key],
      defaultElement = defaultObject[key]
    if (isArray(element) && isArray(defaultElement)) {
      result[key] = arrayDefaultsDeepFromArray(element, defaultElement)
    } else if (element == null) {
      result[key] = defaultElement
    } else if (defaultElement == null) {
      result[key] = element
    } else if (element.constructor == Object && defaultElement.constructor == Object) {
      result[key] = objectDefaultsDeepFromObject(element, defaultElement)
    } else {
      result[key] = element
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
 *   name: 'John',
 *   images: [{ url: 'https://via.placeholder.com/150/0000FF/808080%20?Text=Digital.com' }],
 * }))
 * // {
 * //   name: 'John',
 * //   images: [
 * //    { url: 'https://via.placeholder.com/150/0000FF/808080%20?Text=Digital.com' },
 * //    { url: 'https://via.placeholder.com/150' },
 * //    { url: 'https://via.placeholder.com/150' },
 * //   ],
 * // }
 * ```
 *
 * See also:
 *  * [callProp](/docs/callProp)
 *  * [differenceWith](/docs/differenceWith)
 *
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
