const tapSync = require('./tapSync')
const isPromise = require('./isPromise')
const promiseRace = require('./promiseRace')
const promiseAll = require('./promiseAll')

/**
 * @name arrayMapPoolAsync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayMapPoolAsync<
 *   T any,
 *   array Array<T>,
 *   mapper T=>Promise|any,
 *   concurrencyLimit number,
 *   result Array,
 *   index number,
 *   promises Set<Promise>,
 * >(array, mapper, concurrencyLimit, result, index, promises) -> result
 * ```
 *
 * @description
 * Apply a mapper with limited concurrency to each item of an array, returning a Promise of an array of results.
 */
const arrayMapPoolAsync = async function (
  array, mapper, concurrencyLimit, result, index, promises,
) {
  const arrayLength = array.length
  while (++index < arrayLength) {
    if (promises.size >= concurrencyLimit) {
      await promiseRace(promises)
    }
    const resultItem = mapper(array[index])
    if (isPromise(resultItem)) {
      const selfDeletingPromise = resultItem.then(
        tapSync(() => promises.delete(selfDeletingPromise)))
      promises.add(selfDeletingPromise)
      result[index] = selfDeletingPromise
    } else {
      result[index] = resultItem
    }
  }
  return promiseAll(result)
}

module.exports = arrayMapPoolAsync
