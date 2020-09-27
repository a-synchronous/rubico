const funcConcat = require('./funcConcat')
const __ = require('./placeholder')
const curry3 = require('./curry3')
const curry4 = require('./curry4')
const isPromise = require('./isPromise')
const objectSet = require('./objectSet')

/**
 * @name arrayMapSeriesAsync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayMapSeriesAsync<
 *   T any,
 *   array Array<T>,
 *   mapper T=>Promise|any,
 *   result Array,
 *   index number,
 * >(array, mapper, result Array, index) -> Promise|result
 * ```
 *
 * @description
 * Apply a mapper in series to each item of an array, returning a Promise of an array of results. `mapper` can be asynchronous.
 */
const arrayMapSeriesAsync = async function (
  array, mapper, result, index,
) {
  const arrayLength = array.length
  while (++index < arrayLength) {
    const resultItem = mapper(array[index])
    result[index] = isPromise(resultItem) ? await resultItem : resultItem
  }
  return result
}

/**
 * @name arrayMapSeries
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayMapSeries<
 *   T any,
 *   array Array<T>,
 *   mapper T=>Promise|any,
 * >(array, mapper) -> mappedInSeries Promise|Array
 * ```
 *
 * @description
 * Apply a mapper in series to each item of an array, returning an array of results.
 */
const arrayMapSeries = function (array, mapper) {
  const arrayLength = array.length,
    result = Array(arrayLength)
  let index = -1

  while (++index < arrayLength) {
    const resultItem = mapper(array[index])
    if (isPromise(resultItem)) {
      return resultItem.then(funcConcat(
        curry3(objectSet, result, index, __),
        curry4(arrayMapSeriesAsync, array, mapper, __, index)))
    }
    result[index] = resultItem
  }
  return result
}

module.exports = arrayMapSeries
