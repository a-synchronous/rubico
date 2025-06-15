const curry4 = require('./curry4')
const __ = require('./placeholder')
const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')
const arrayExtendMapIndexes = require('./arrayExtendMapIndexes')
const arrayFilterByConditions = require('./arrayFilterByConditions')

/**
 * @name arrayFilterIndexes
 *
 * @synopsis
 * ```coffeescript [specscript]
 * KeyPredicate = (key string)=>Promise|boolean
 *
 * arrayFilterIndexes(
 *   predicate KeyPredicate,
 *   array Array,
 * ) -> result Promise|Array
 * ```
 */
const arrayFilterIndexes = function (predicate, array) {
  const arrayLength = array.length,
    result = []
  let index = -1,
    resultIndex = -1
  while (++index < arrayLength) {
    const element = array[index],
      shouldIncludeElement = predicate(index)
    if (isPromise(shouldIncludeElement)) {
      const predicationPromises = [shouldIncludeElement]
      return promiseAll(
        arrayExtendMapIndexes(
          [shouldIncludeElement], array, predicate, index)).then(
            curry4(arrayFilterByConditions, array, result, index - 1, __))
    }
    if (shouldIncludeElement) {
      result[++resultIndex] = element
    }
  }
  return result
}

module.exports = arrayFilterIndexes
