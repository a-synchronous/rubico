const isArrayLike = require('./isArrayLike')

/**
 * @name _arrayExtend
 *
 * @synopsis
 * ```coffeescript [specscript]
 * _arrayExtend(array Array, values Array) -> array
 * ```
 */
const _arrayExtend = function (array, values) {
  const arrayLength = array.length,
    valuesLength = values.length
  let valuesIndex = -1
  while (++valuesIndex < valuesLength) {
    array[arrayLength + valuesIndex] = values[valuesIndex]
  }
  return array
}

/**
 * @name arrayExtend
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayExtend(array Array, values Array) -> array
 * ```
 *
 * @description
 * Extend an array with values.
 */
const arrayExtend = function (array, values) {
  if (isArrayLike(values)) {
    return _arrayExtend(array, values)
  }
  array.push(values)
  return array
}

module.exports = arrayExtend
