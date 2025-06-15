const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')
const always = require('./always')

/**
 * @name asyncIteratorForEach
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var T any,
 *   asyncIterator AsyncIterator<T>,
 *   callback T=>()
 *
 * asyncIteratorForEach(asyncIterator, callback) -> Promise<>
 * ```
 *
 * @description
 * Execute a callback function for each element of an async iterator
 */
const asyncIteratorForEach = async function (asyncIterator, callback) {
  const promises = []
  for await (const element of asyncIterator) {
    const operation = callback(element)
    if (isPromise(operation)) {
      promises.push(operation)
    }
  }
  return promises.length == 0 ? asyncIterator
    : promiseAll(promises).then(always(asyncIterator))
}

module.exports = asyncIteratorForEach
