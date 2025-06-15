const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')

/**
 * @name arrayMap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayMap(
 *   array Array,
 *   mapper (element any, index number, array Array)=>Promise|any,
 * ) -> Promise|Array
 * ```
 *
 * @description
 * Apply a mapper to each element of an array, returning an array. Mapper may be asynchronous.
 */
const arrayMap = function (array, mapper) {
  const arrayLength = array.length,
    result = Array(arrayLength)
  let index = -1,
    isAsync = false

  while (++index < arrayLength) {
    const resultElement = mapper(array[index], index, array)
    if (isPromise(resultElement)) {
      isAsync = true
    }
    result[index] = resultElement
  }
  return isAsync ? promiseAll(result) : result
}

module.exports = arrayMap
