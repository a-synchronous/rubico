const curry4 = require('./curry4')
const __ = require('./placeholder')
const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')
const arrayExtendMapWithIndex = require('./arrayExtendMapWithIndex')
const arrayFilterByConditions = require('./arrayFilterByConditions')

/**
 * @name arrayFilterWithIndex
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayFilterWithIndex<
 *   T any,
 *   array Array<T>,
 *   index number,
 *   indexedPredicate (T, index, array)=>Promise|boolean,
 * >(array, indexedPredicate) -> filteredWithIndex Array<T>
 * ```
 *
 * @description
 * Filter an array concurrently by predicate.
 */
const arrayFilterWithIndex = function (array, predicate) {
  const arrayLength = array.length,
    result = []
  let index = -1,
    resultIndex = -1
  while (++index < arrayLength) {
    const item = array[index],
      shouldIncludeItem = predicate(item, index, array)
    if (isPromise(shouldIncludeItem)) {
      return promiseAll(
        arrayExtendMapWithIndex(
          [shouldIncludeItem], array, predicate, index)).then(
            curry4(arrayFilterByConditions, array, result, index - 1, __))
    }
    if (shouldIncludeItem) {
      result[++resultIndex] = item
    }
  }
  return result
}

module.exports = arrayFilterWithIndex
