const isArray = require('./isArray')
const isPromise = require('./isPromise')

/**
 * @name areAnyValuesPromises
 *
 * @synopsis
 * ```coffeescript [specscript]
 * areAnyValuesPromises(values Array) -> boolean
 * areAnyValuesPromises(values Object) -> boolean
 * ```
 */
const areAnyValuesPromises = function (values) {
  if (isArray(values)) {
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

  for (const key in values) {
    const value = values[key]
    if (isPromise(value)) {
      return true
    }
  }
  return false
}

module.exports = areAnyValuesPromises
