const __ = require('./placeholder')
const curry3 = require('./curry3')
const isPromise = require('./isPromise')
const iteratorReduceAsync = require('./iteratorReduceAsync')

/**
 * @name iteratorReduce
 *
 * @synopsis
 * ```coffeescript [specscript]
 * iteratorReduce<T>(
 *   iterator Iterator<Promise|T>,
 *   reducer (any, T)=>Promise|any,
 *   result any,
 * ) -> Promise|result
 * ```
 *
 * @description
 * Execute a reducer for each item of an iterator, returning a single value.
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
      return result.then(curry3(iteratorReduceAsync, iterator, reducer, __))
    }
    iteration = iterator.next()
  }
  return result
}

module.exports = iteratorReduce
