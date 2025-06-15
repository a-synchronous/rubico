const isPromise = require('./isPromise')
const thunkify2 = require('./thunkify2')

// _iteratorForEachSeriesAsync(
//   iterator Iterator,
//   callback function,
// ) -> Promise<iterator>
const _iteratorForEachSeriesAsync = async function (iterator, callback) {
  let iteration = iterator.next()
  while (!iteration.done) {
    const operation = callback(iteration.value)
    if (isPromise(operation)) {
      await operation
    }
    iteration = iterator.next()
  }
  return iterator
}

/**
 * @name iteratorForEachSeries
 *
 * @synopsis
 * ```coffeescript [specscript]
 * iteratorForEachSeries(iterator Iterator, callback function) -> iterator
 * ```
 *
 * @description
 * Call a callback for each element of an iterator. Return a promise if any executions are asynchronous.
 *
 * Note: iterator is consumed
 */
const iteratorForEachSeries = function (iterator, callback) {
  let iteration = iterator.next()
  while (!iterator.done) {
    const operation = callback(iteration.value)
    if (isPromise(operation)) {
      return operation
        .then(thunkify2(_iteratorForEachSeriesAsync, iterator, callback))
    }
    iteration = iterator.next()
  }
  return iterator
}

module.exports = iteratorForEachSeries
