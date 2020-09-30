const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')
const always = require('./always')

/**
 * @name arrayForEach
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var T any,
 *   array Array<T>,
 *   callback T=>()
 *
 * arrayForEach(array, callback) -> ()
 * ```
 *
 * @description
 * Call a callback for each item of an iterator. Return a promise if any executions are asynchronous.
 *
 * Note: iterator is consumed
 */
const arrayForEach = function (array, callback) {
  const length = array.length,
    promises = []
  let index = -1
  while (++index < length) {
    const operation = callback(array[index])
    if (isPromise(operation)) {
      promises.push(operation)
    }
  }
  return promises.length == 0 ? array : promiseAll(promises).then(always(array))
}

module.exports = arrayForEach
