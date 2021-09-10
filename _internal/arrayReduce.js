const isPromise = require('./isPromise')
const __ = require('./placeholder')
const curry4 = require('./curry4')

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
    result = reducer(result, array[index], index, array)
    if (isPromise(result)) {
      result = await result
    }
  }
  return result
}

/**
 * @name arrayReduce
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayReduce<T>(
 *   array Array<T>,
 *   reducer (any, T)=>Promise|any,
 *   result any,
 * ) -> Promise|result
 * ```
 */
const arrayReduce = function (array, reducer, result) {
  const arrayLength = array.length
  let index = -1
  if (result === undefined) {
    result = array[++index]
  }
  while (++index < arrayLength) {
    result = reducer(result, array[index], index, array)
    if (isPromise(result)) {
      return result.then(curry4(arrayReduceAsync, array, reducer, __, index))
    }
  }
  return result
}

module.exports = arrayReduce
