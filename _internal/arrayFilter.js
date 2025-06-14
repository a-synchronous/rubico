const curry4 = require('./curry4')
const __ = require('./placeholder')
const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')
const arrayExtendMap = require('./arrayExtendMap')
const arrayFilterByConditions = require('./arrayFilterByConditions')

/**
 * @name arrayFilter
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayFilter<T>(
 *   array Array<T>,
 *   predicate T=>Promise|boolean,
 * ) -> result Promise|Array<T>
 * ```
 *
 * @description
 * Filter an array concurrently by predicate. `predicate` may be asynchronous.
 */
const arrayFilter = function (array, predicate) {
  const arrayLength = array.length,
    result = []
  let index = -1,
    resultIndex = -1
  while (++index < arrayLength) {
    const element = array[index],
      shouldIncludeElement = predicate(element, index, array)
    if (isPromise(shouldIncludeElement)) {
      return promiseAll(
        arrayExtendMap([shouldIncludeElement], array, predicate, index)
      ).then(curry4(arrayFilterByConditions, array, result, index - 1, __))
    }
    if (shouldIncludeElement) {
      result[++resultIndex] = element
    }
  }
  return result
}

module.exports = arrayFilter
