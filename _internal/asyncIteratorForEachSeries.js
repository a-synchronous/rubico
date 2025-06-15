const isPromise = require('./isPromise')

/**
 * @name asyncIteratorForEachSeries
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var T any,
 *   asyncIterator AsyncIterator<T>,
 *   callback T=>()
 *
 * asyncIteratorForEachSeries(asyncIterator, callback) -> Promise<>
 * ```
 *
 * @description
 * Execute a callback function for each element of an async iterator in series.
 */
const asyncIteratorForEachSeries = async function (asyncIterator, callback) {
  for await (const element of asyncIterator) {
    const operation = callback(element)
    if (isPromise(operation)) {
      await operation
    }
  }
  return asyncIterator
}

module.exports = asyncIteratorForEachSeries
