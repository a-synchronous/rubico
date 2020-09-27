const isPromise = require('./isPromise')
const tapSync = require('./tapSync')
const arrayMapPoolAsync = require('./arrayMapPoolAsync')

/**
 * @name
 * arrayMapPool
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayMapPool<
 *   T any,
 *   array Array<T>
 *   mapper T=>Promise|any,
 *   concurrentLimit number,
 * >(array, mapper, concurrentLimit) -> Promise|Array
 * ```
 *
 * @description
 * Apply a mapper with limited concurrency to each item of an array, returning an array of results.
 */
const arrayMapPool = function (array, mapper, concurrentLimit) {
  const arrayLength = array.length,
    result = Array(arrayLength)
  let index = -1

  while (++index < arrayLength) {
    const resultItem = mapper(array[index])
    if (isPromise(resultItem)) {
      const promises = new Set(),
        selfDeletingPromise = resultItem.then(
          tapSync(() => promises.delete(selfDeletingPromise)))
      promises.add(selfDeletingPromise)
      result[index] = selfDeletingPromise
      return arrayMapPoolAsync(
        array, mapper, concurrentLimit, result, index, promises)
    }
    result[index] = resultItem
  }
  return result
}

module.exports = arrayMapPool
