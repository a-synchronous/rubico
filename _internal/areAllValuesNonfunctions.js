const isArray = require('./isArray')

/**
 * @name areAllValuesNonfunctions
 *
 * @synopsis
 * ```coffeescript [specscript]
 * areAllValuesNonfunctions(values Array<function|value>) -> boolean
 * areAllValuesNonfunctions(values Object<function|value>) -> boolean
 * ```
 */
const areAllValuesNonfunctions = function (values) {
  if (isArray(values)) {
    const length = values.length
    let index = -1
    while (++index < length) {
      if (typeof values[index] == 'function') {
        return false
      }
    }
    return true
  }

  for (const key in values) {
    if (typeof values[key] == 'function') {
      return false
    }
  }
  return true
}

module.exports = areAllValuesNonfunctions
