/**
 * @name arrayFilterByConditions
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayFilterByConditions(
 *   array Array,
 *   result Array,
 *   index number,
 *   conditions Array<boolean>,
 * ) -> result
 * ```
 *
 * @description
 * Filter an array by a boolean array of conditions
 *
 * @TODO switch positions of index and conditions
 */
const arrayFilterByConditions = function (
  array, result, index, conditions,
) {
  const arrayLength = array.length
  let conditionsIndex = -1
  while (++index < arrayLength) {
    if (conditions[++conditionsIndex]) {
      result.push(array[index])
    }
  }
  return result
}

module.exports = arrayFilterByConditions
