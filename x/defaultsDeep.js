const isArray = require('../_internal/isArray')
const curry2 = require('../_internal/curry2')
const __ = require('../_internal/placeholder')

/**
 * @name arrayDefaultsDeepFromArray
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayDefaultsDeepFromArray(
 *   data Array<Array|Object|any>,
 *   defaults Array<Array|Object|any>
 * ) -> Object
 * ```
 */
function arrayDefaultsDeepFromArray(data, defaults) {
  const defaultArrayLength = defaults.length,
    result = data.slice()
  let index = -1
  while (++index < defaultArrayLength) {
    const element = data[index],
      defaultElement = defaults[index]
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
 * objectDefaultsDeepFromObject(
 *   data Object<Array|Object|any>,
 *   defaults Object<Array|Object|any>
 * ) -> Object
 * ```
 */
function objectDefaultsDeepFromObject(data, defaults) {
  const result = { ...data }
  for (const key in defaults) {
    const element = data[key],
      defaultElement = defaults[key]
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
 * @name _defaultsDeep
 *
 * @synopsis
 * ```coffeescript [specscript]
 * _defaultsDeep(
 *   data Object<Array|Object|any>,
 *   defaults (Object|Array)<Array|Object|any>
 * ) -> result Object
 * ```
 */
function _defaultsDeep(data, defaults) {
  if (isArray(data) && isArray(defaults)) {
    return arrayDefaultsDeepFromArray(data, defaults)
  }
  if (data == null || defaults == null) {
    return data
  }
  if (data.constructor == Object && defaults.constructor == Object) {
    return objectDefaultsDeepFromObject(data, defaults)
  }
  return data
}

/**
 * @name defaultsDeep
 *
 * @synopsis
 * ```coffeescript [specscript]
 * data (Object|Array)<Array|Object|any>
 * defaults (Object|Array)<Array|Object|any>
 *
 * defaultsDeep(data, defaults) -> result Object
 * defaultsDeep(defaults)(data) -> result Object
 * ```
 *
 * @description
 * Deeply assign default values to an object or array `data` using an array or object of default values `defaults`. The keys or indices of each element of `defaults` are used to extend `data` where there is no existing value. Both `data` and `defaults` may have nested arrays or objects.
 *
 * ```javascript [playground]
 * import defaultsDeep from 'https://unpkg.com/rubico/dist/x/defaultsDeep.es.js'
 *
 * const user = {
 *   name: 'John',
 *   images: [{ url: 'https://placehold.co/600x400' }],
 * }
 *
 * const userWithDefaults = defaultsDeep(user, {
 *   name: 'placeholder',
 *   images: [
 *     { url: 'https://placehold.co/150' },
 *     { url: 'https://placehold.co/150' },
 *     { url: 'https://placehold.co/150' },
 *   ],
 * })
 *
 * console.log(userWithDefaults)
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
 * The `defaults` array or object may be provided to `defaultsDeep` without `data` to create a lazy version of `defaultsDeep` that accepts `data` as a single argument. This "lazy" API can be used for function pipelines and function compositions.
 *
 * ```javascript [playground]
 * pipe({ a: 1 }, [
 *   defaultsDeep({ b: 2, c: 3, g: [1, 2, 3] }),
 *   console.log, // { a: 1, b: 2, c: 3, g: [1, 2, 3] }
 * ])
 * ```
 *
 * See also:
 *  * [pipe](/docs/pipe)
 *  * [compose](/docs/compose)
 *  * [callProp](/docs/callProp)
 *  * [differenceWith](/docs/differenceWith)
 *
 */
function defaultsDeep(...args) {
  if (args.length == 1) {
    return curry2(_defaultsDeep, __, args[0])
  }
  if (args.length == 2) {
    return _defaultsDeep(...args)
  }
  throw new TypeError('Invalid number of arguments')
}

module.exports = defaultsDeep
