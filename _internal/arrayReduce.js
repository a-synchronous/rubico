const __ = require('./placeholder')
const curry4 = require('./curry4')

const isPromise = value => value != null && typeof value.then == 'function'

/**
 * @name arrayReduce
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayReduce(
 *   array Array<T>,
 *   reducer (any, T)=>Promise|any,
 *   result any,
 * ) -> result
 * ```
 */
const arrayReduce = function (array, reducer, result) {
  const arrayLength = array.length
  let index = -1
  if (result === undefined) {
    result = array[++index]
  }

  while (++index < arrayLength) {
    result = reducer(result, array[index])
    if (isPromise(result)) {
      return result.then(
        curry4(asyncArrayReduce, array, reducer, __, index))
    }
  }
  return result
}

module.exports = arrayReduce
