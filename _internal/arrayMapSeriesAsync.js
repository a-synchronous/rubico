const isPromise = require('./isPromise')

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

module.exports = arrayMapSeriesAsync
