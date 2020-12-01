const getByPath = require('./getByPath')
const propertyPathToArray = require('./propertyPathToArray')

/**
 * @name deleteByPath
 *
 * @synopsis
 * ```coffeescript [specscript]
 * deleteByPath<
 *   object any,
 *   path string|number|Array<string|number>,
 * >(value, path) -> ()
 * ```
 */
const deleteByPath = function (object, path) {
  const propertyPathArray = propertyPathToArray(path),
    length = propertyPathArray.length,
    lengthMinusOne = propertyPathArray.length - 1
  let index = -1,
    result = object
  while (++index < lengthMinusOne) {
    result = result[propertyPathArray[index]]
    if (result == null) {
      return undefined
    }
  }
  delete result[propertyPathArray[index]]
  return undefined
}

module.exports = deleteByPath
