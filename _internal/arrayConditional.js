/**
 * @name arrayConditional
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayConditional(array Array<value>) -> boolean
 * ```
 */
const arrayConditional = function (array) {
  const length = array.length
  let index = -2
  while ((index += 2) < length) {
    if (array[index]) {
      return array[index + 1]
    }
  }
  if (index == length) {
    return undefined
  }
  return array[index]
}

module.exports = arrayConditional
