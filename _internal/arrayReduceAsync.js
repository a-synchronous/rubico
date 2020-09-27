const isPromise = require('./isPromise')

/**
 * @name arrayReduceAsync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayReduceAsync<T>(
 *   array Array<T>,
 *   reducer (any, T)=>any,
 *   result any,
 *   index number,
 * ) -> result
 * ```
 *
 * @description
 * Execute a reducer for each item of an array, returning a Promise of a single value.
 */
const arrayReduceAsync = async function (
  array, reducer, result, index,
) {
  const length = array.length
  while (++index < length) {
    result = reducer(result, array[index])
    if (isPromise(result)) {
      result = await result
    }
  }
  return result
}

module.exports = arrayReduceAsync
