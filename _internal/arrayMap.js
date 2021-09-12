const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')

/**
 * @name arrayMap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayMap(
 *   array Array,
 *   mapper (item any, index number, array Array)=>Promise|any,
 * ) -> Promise|Array
 * ```
 *
 * @description
 * Apply a mapper to each item of an array, returning an array. Mapper may be asynchronous.
 */
const arrayMap = function (array, mapper) {
  const arrayLength = array.length,
    result = Array(arrayLength)
  let index = -1,
    isAsync = false

  while (++index < arrayLength) {
    const resultItem = mapper(array[index], index, array)
    if (isPromise(resultItem)) {
      isAsync = true
    }
    result[index] = resultItem
  }
  return isAsync ? promiseAll(result) : result
}

module.exports = arrayMap
