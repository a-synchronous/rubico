const tapSync = require('./tapSync')
const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')
const promiseRace = require('./promiseRace')

/**
 * @name arrayMapPoolAsync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayMapPoolAsync<
 *   T any,
 *   array Array<T>,
 *   f T=>Promise|any,
 *   concurrencyLimit number,
 *   result Array,
 *   index number,
 *   promises Set<Promise>,
 * >(array, f, concurrencyLimit, result, index, promises) -> result
 * ```
 *
 * @description
 * Apply a function `f` with limited concurrency to each item of an array, returning a Promise of an array of results.
 */
const arrayMapPoolAsync = async function (
  array, f, concurrencyLimit, result, index, promises,
) {
  const arrayLength = array.length
  while (++index < arrayLength) {
    if (promises.size >= concurrencyLimit) {
      await promiseRace(promises)
    }
    const resultItem = f(array[index])
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

/**
 * @name arrayMapPool
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayMapPool(array Array, concurrency number, f function) -> Promise|string
 * ```
 *
 * @description
 * Apply a function `f` with limited concurrency to each item of an array, returning an array of results.
 */
const arrayMapPool = function (array, concurrency, f) {
  const arrayLength = array.length,
    result = Array(arrayLength)
  let index = -1
  while (++index < arrayLength) {
    const resultItem = f(array[index])
    if (isPromise(resultItem)) {
      const promises = new Set(),
        selfDeletingPromise = resultItem.then(
          tapSync(() => promises.delete(selfDeletingPromise)))
      promises.add(selfDeletingPromise)
      result[index] = selfDeletingPromise
      return arrayMapPoolAsync(
        array, f, concurrency, result, index, promises)
    }
    result[index] = resultItem
  }
  return result
}

module.exports = arrayMapPool
