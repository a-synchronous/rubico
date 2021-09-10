/**
 * @name arrayExtendMapIndexes
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayExtendMapIndexes(
 *   array Array,
 *   values Array,
 *   mapper function,
 *   index number,
 * ) -> array
 * ```
 *
 * @description
 * `arrayExtend` while mapping indexes
 */
const arrayExtendMapIndexes = function (
  array, values, mapper, index,
) {
  const valuesLength = values.length
  let arrayIndex = array.length - 1
  while (++index < valuesLength) {
    array[++arrayIndex] = mapper(index)
  }
  return array
}

module.exports = arrayExtendMapIndexes
