const promiseAll = require('./promiseAll')
const isPromise = require('./isPromise')

/**
 * @name arrayExtendMapWithIndex
 *
 * @catchphrase
 * internal extend while mapping with index
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayExtendMapWithIndex<
 *   T any,
 *   array Array<T>,
 *   values Array<T>,
 *   mapper T=>Promise|any,
 *   index number,
 * >(array, values, mapper, index) -> Promise|array
 * ```
 *
 * @description
 * Extend an array with values from a mapping operation.
 */
const arrayExtendMapWithIndex = function (
  array, values, mapper, index,
) {
  const valuesLength = values.length
  let arrayIndex = array.length - 1,
    isAsync = false
  while (++index < valuesLength) {
    const nextItem = mapper(values[index], index, values)
    if (isPromise(nextItem)) {
      isAsync = true
    }
    array[++arrayIndex] = nextItem
  }
  return isAsync ? promiseAll(array) : array
}

module.exports = arrayExtendMapWithIndex
