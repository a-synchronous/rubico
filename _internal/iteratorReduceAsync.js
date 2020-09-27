const isPromise = require('./isPromise')

/**
 * @name iteratorReduceAsync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * iteratorReduceAsync<
 *   T any,
 *   iterator Iterator<T>|AsyncIterator<T>,
 *   reducer (any, T)=>Promise|any,
 *   result any?,
 * >(iterator, reducer, result) -> Promise<result>
 * ```
 *
 * @description
 * Execute a reducer for each item of an iterator or async iterator, returning a promise of a single value.
 */
const iteratorReduceAsync = async function (
  iterator, reducer, result,
) {
  let iteration = iterator.next()
  if (isPromise(iteration)) {
    iteration = await iteration
  }
  if (iteration.done) {
    return result
  }
  if (result === undefined) {
    result = iteration.value
    iteration = iterator.next()
    if (isPromise(iteration)) {
      iteration = await iteration
    }
  }
  while (!iteration.done) {
    result = await reducer(result, iteration.value)
    iteration = await iterator.next()
  }
  return result
}

module.exports = iteratorReduceAsync
