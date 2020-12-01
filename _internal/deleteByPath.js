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
  const pathArray = propertyPathToArray(path),
    lengthMinusOne = pathArray.length - 1
  let index = -1,
    result = object
  while (++index < lengthMinusOne) {
    result = result[pathArray[index]]
    if (result == null) {
      return undefined
    }
  }
  delete result[pathArray[index]]
  return undefined
}

module.exports = deleteByPath
