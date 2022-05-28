/**
 * @name areFuncsOrValuesAllValues
 *
 * @synopsis
 * ```coffeescript [specscript]
 * areFuncsOrValuesAllValues(funcsOrValues Array<function|value>) -> boolean
 * ```
 */
const areFuncsOrValuesAllValues = function (funcsOrValues) {
  const length = funcsOrValues.length
  let index = -1
  while (++index < length) {
    if (typeof funcsOrValues[index] == 'function') {
      return false
    }
  }
  return true
}

module.exports = areFuncsOrValuesAllValues
