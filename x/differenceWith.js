const __ = require('../_internal/placeholder')
const curry2 = require('../_internal/curry2')
const curry3 = require('../_internal/curry3')
const thunkify2 = require('../_internal/thunkify2')
const thunkify5 = require('../_internal/thunkify5')
const thunkConditional = require('../_internal/thunkConditional')
const isPromise = require('../_internal/isPromise')
const isArray = require('../_internal/isArray')
const arrayAny = require('../_internal/arrayAny')
const arrayPush = require('../_internal/arrayPush')
const funcConcatSync = require('../_internal/funcConcatSync')
const noop = require('../_internal/noop')
const symbolIterator = require('../_internal/symbolIterator')
const symbolAsyncIterator = require('../_internal/symbolAsyncIterator')

/**
 * @name differenceWithArrayAsync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * differenceWithArrayAsync(
 *   comparator (any, any)=>Promise|boolean,
 *   allValues Array,
 *   array Array,
 *   result Array,
 *   index number,
 * ) -> result Promise<Array>
 * ```
 */
const differenceWithArrayAsync = async function (
  comparator, allValues, array, result, index
) {
  const allValuesLength = allValues.length
  while (++index < allValuesLength) {
    const item = allValues[index]
    let doesItemExistByComparator = arrayAny(array, curry2(comparator, item, __))
    if (isPromise(doesItemExistByComparator)) {
      doesItemExistByComparator = await doesItemExistByComparator
    }
    if (!doesItemExistByComparator) {
      result.push(item)
    }
  }
  return result
}

/**
 * @name differenceWithArray
 *
 * @synopsis
 * ```coffeescript [specscript]
 * differenceWithArray(
 *   comparator (any, any)=>Promise|boolean,
 *   allValues Array,
 *   array Array,
 * ) -> someOrAllValues Promise|Array
 * ```
 */
const differenceWithArray = function (comparator, allValues, array) {
  const allValuesLength = allValues.length,
    result = []
  let index = -1
  while (++index < allValuesLength) {
    const item = allValues[index],
      doesItemExistByComparator = arrayAny(array, curry2(comparator, item, __))
    if (isPromise(doesItemExistByComparator)) {
      return doesItemExistByComparator.then(funcConcatSync(
        curry3(thunkConditional, __, noop, thunkify2(arrayPush, result, item)),
        thunkify5(differenceWithArrayAsync, comparator, allValues, array, result, index)))
    } else if (!doesItemExistByComparator) {
      result.push(item)
    }
  }
  return result
}

/**
 * @name differenceWith
 *
 * @synopsis
 * ```coffeescript [specscript]
 * differenceWith(
 *   comparator (any, any)=>Promise|boolean,
 *   allValues Array,
 * )(values Array) -> someOrAllValues Array
 * ```
 *
 * @description
 * Create an array of all the values in an array that are not in another array as dictated by a comparator.
 *
 * ```javascript [playground]
 * import differenceWith from 'https://unpkg.com/rubico/dist/x/differenceWith.es.js'
 * import isDeepEqual from 'https://unpkg.com/rubico/dist/x/isDeepEqual.es.js'
 *
 * console.log(
 *   differenceWith(isDeepEqual, [{ a: 1 }, { b: 2 }, { c: 3 }])([{ b: 2 }]),
 * ) // [{ a: 1 }, { c: 3 }]
 * ```
 */
const differenceWith = (
  comparator, allValues,
) => function excludingValues(values) {
  if (isArray(values)) {
    return differenceWithArray(comparator, allValues, values)
  }
  throw new TypeError(`${values} is not an Array`)
}

module.exports = differenceWith
