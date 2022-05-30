/**
 * @name areAllValuesNonfunctions
 *
 * @synopsis
 * ```coffeescript [specscript]
 * areAllValuesNonfunctions(values Array<function|value>) -> boolean
 * ```
 */
const areAllValuesNonfunctions = function (values) {
  const length = values.length
  let index = -1
  while (++index < length) {
    if (typeof values[index] == 'function') {
      return false
    }
  }
  return true
}

module.exports = areAllValuesNonfunctions
