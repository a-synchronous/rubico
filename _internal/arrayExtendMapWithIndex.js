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
  array, values, valuesMapper, valuesIndex,
) {
  const valuesLength = values.length
  let arrayIndex = array.length - 1

  while (++valuesIndex < valuesLength) {
    array[++arrayIndex] = valuesMapper(
      values[valuesIndex], valuesIndex, values)
  }
  return array
}

module.exports = arrayExtendMapWithIndex
