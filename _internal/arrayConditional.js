/**
 * @name arrayConditional
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayConditional(array Array<value>) -> boolean
 * ```
 */
const arrayConditional = function (array) {
  const length = array.length,
    lastIndex = length - 1
  let index = -2
  while ((index += 2) < lastIndex) {
    if (array[index]) {
      return array[index + 1]
    }
  }
  // even number of array values
  if (index == length) {
    return undefined
  }
  return array[index]
}

module.exports = arrayConditional
