const isPromise = require('./isPromise')

/**
 * @name areAnyValuesPromises
 *
 * @synopsis
 * ```coffeescript [specscript]
 * areAnyValuesPromises(values Array) -> boolean
 * ```
 */
const areAnyValuesPromises = function (values) {
  const length = values.length
  let index = -1
  while (++index < length) {
    const value = values[index]
    if (isPromise(value)) {
      return true
    }
  }
  return false
}

module.exports = areAnyValuesPromises
