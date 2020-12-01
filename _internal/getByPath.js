const propertyPathToArray = require('./propertyPathToArray')

/**
 * @name getByPath
 *
 * @synopsis
 * ```coffeescript [specscript]
 * getByPath<
 *   value any,
 *   path string|number|Array<string|number>,
 * >(value, path) -> valueAtPath any
 * ```
 */
const getByPath = function (value, path) {
  const propertyPathArray = propertyPathToArray(path),
    length = propertyPathArray.length
  let index = -1,
    result = value
  while (++index < length) {
    result = result[propertyPathArray[index]]
    if (result == null) {
      return undefined
    }
  }
  return result
}

module.exports = getByPath
