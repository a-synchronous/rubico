const __ = require('./placeholder')
const curry3 = require('./curry3')
const isPromise = require('./isPromise')

/**
 * @name iteratorReduce
 *
 * @synopsis
 * ```coffeescript [specscript]
 * iteratorReduce(
 *   iterator Iterator<T>,
 *   reducer (any, T)=>Promise|any,
 *   result any,
 * ) -> result
 * ```
 */
const iteratorReduce = function (iterator, reducer, result) {
  let iteration = iterator.next()
  if (iteration.done) {
    return result
  }
  if (result === undefined) {
    result = iteration.value
    iteration = iterator.next()
  }

  while (!iteration.done) {
    result = reducer(result, iteration.value)
    if (isPromise(result)) {
      return result.then(curry3(asyncIteratorReduce, iterator, reducer, __))
    }
    iteration = iterator.next()
  }
  return result
}

module.exports = iteratorReduce
