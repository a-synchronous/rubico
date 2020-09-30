const __ = require('./placeholder')
const curry3 = require('./curry3')
const isPromise = require('./isPromise')

/**
 * @name iteratorReduceAsync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var T any,
 *   iterator Iterator<T>,
 *   reducer (any, T)=>Promise|any,
 *   result any,
 *
 * iteratorReduceAsync(iterator, reducer, result) -> Promise
 * ```
 *
 * @description
 * Execute a reducer for each item of an iterator or async iterator, returning a promise of a single value.
 */
const iteratorReduceAsync = async function (
  iterator, reducer, result,
) {
  let iteration = iterator.next()
  if (iteration.done) {
    return result
  }

  while (!iteration.done) {
    result = reducer(result, iteration.value)
    if (isPromise(result)) {
      result = await result
    }
    iteration = iterator.next()
  }
  return result
}

/**
 * @name iteratorReduce
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var T any,
 *   iterator Iterator<T>,
 *   reducer (any, T)=>Promise|any,
 *   result any,
 *
 * iteratorReduce(iterator, reducer, result?) -> Promise|any
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
