const isArray = require('../_internal/isArray')
const isPromise = require('../_internal/isPromise')
const promiseAll = require('../_internal/promiseAll')
const __ = require('../_internal/placeholder')
const curry3 = require('../_internal/curry3')
const thunkify2 = require('../_internal/thunkify2')
const thunkify4 = require('../_internal/thunkify4')
const funcConcatSync = require('../_internal/funcConcatSync')
const callPropUnary = require('../_internal/callPropUnary')
const thunkConditional = require('../_internal/thunkConditional')
const arrayFlatten = require('../_internal/arrayFlatten')
const arrayPush = require('../_internal/arrayPush')
const noop = require('../_internal/noop')

/**
 * @name arrayIncludesWith
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var T any,
 *   array Array<T>,
 *   value T,
 *   comparator (T, T)=>boolean
 *
 * arrayIncludesWith
 * ```
 */
const arrayIncludesWith = function (array, value, comparator) {
  const length = array.length,
    promises = []
  let index = -1
  while (++index < length) {
    const predication = comparator(value, array[index])
    if (isPromise(predication)) {
      promises.push(predication)
    } else if (predication) {
      return true
    }
  }
  return promises.length == 0 ? false
    : promiseAll(promises).then(curry3(callPropUnary, __, 'some', Boolean))
}

/**
 * @name arrayUniqWithAsync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var T any,
 *   array Array<T>,
 *   comparator (T, T)=>Promise|boolean
 *
 * arrayUniqWithAsync(array, comparator) -> Promise<Array<T>>
 * ```
 */
const arrayUniqWithAsync = async function (array, comparator, result, index) {
  const length = array.length
  while (++index < length) {
    const item = array[index],
      itemAlreadyExists = arrayIncludesWith(result, item, comparator)
    if (!(
      isPromise(itemAlreadyExists) ? await itemAlreadyExists : itemAlreadyExists
    )) {
      result.push(item)
    }
  }
  return result
}

/**
 * @name arrayUniqWith
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var T any,
 *   array Array<T>,
 *   comparator (T, T)=>Promise|boolean
 *
 * arrayUniqWith(array, comparator) -> Promise|Array<T>
 * ```
 *
 * @TODO rubico/x/uniqWith
 */
const arrayUniqWith = function (array, comparator) {
  const length = array.length,
    result = []
  let index = -1
  while (++index < length) {
    const item = array[index],
      itemAlreadyExists = arrayIncludesWith(result, item, comparator)
    if (isPromise(itemAlreadyExists)) {
      return itemAlreadyExists.then(funcConcatSync(
        curry3(thunkConditional, __, noop, thunkify2(arrayPush, result, item)),
        thunkify4(arrayUniqWithAsync, array, comparator, result, index)))
    } else if (!itemAlreadyExists) {
      result.push(item)
    }
  }
  return result
}

/**
 * @name unionWith
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var T any,
 *   arrayOfArrays Array<Array<T>>,
 *   comparator (T, T)=>Promise|boolean
 *
 * unionWith(comparator)(arrayOfArrays) -> Array<T>
 * ```
 *
 * @description
 * Create an array of unique values from an array of arrays with uniqueness determined by a comparator. The comparator is a function that returns a boolean value, `true` if two given values are distinct.
 *
 * ```javascript [playground]
 * import isDeepEqual from 'https://unpkg.com/rubico/dist/x/isDeepEqual.es.js'
 * import unionWith from 'https://unpkg.com/rubico/dist/x/unionWith.es.js'
 *
 * console.log(
 *   unionWith(isDeepEqual)([
 *     [{ a: 1 }, { b: 2 }, { a: 1 }],
 *     [{ b: 2 }, { b: 2 }, { b: 2 }],
 *   ]),
 * ) // [{ a: 1 }, { b: 2 }]
 * ```
 *
 * @TODO setUnionWith
 */
const unionWith = comparator => function unioning(value) {
  if (isArray(value)) {
    return arrayUniqWith(arrayFlatten(value), comparator)
  }
  throw new TypeError(`${value} is not an Array`)
}

module.exports = unionWith
