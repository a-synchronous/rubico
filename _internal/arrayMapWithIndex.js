const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')

/**
 * @name arrayMapWithIndex
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayMapWithIndex<
 *   T any,
 *   array Array<T>,
 *   index number,
 *   indexedMapper (T, index, array)=>Promise|any,
 * >(array, mapper) -> mappedWithIndex Promise|Array
 * ```
 *
 * @description
 * Apply an indexed mapper to each element of an array, returning an array of results.
 */
const arrayMapWithIndex = function (array, mapper) {
  const arrayLength = array.length,
    result = Array(arrayLength)
  let index = -1, isAsync = false
  while (++index < arrayLength) {
    const resultElement = mapper(array[index], index, array)
    if (isPromise(resultElement)) {
      isAsync = true
    }
    result[index] = resultElement
  }
  return isAsync ? promiseAll(result) : result
}

module.exports = arrayMapWithIndex
