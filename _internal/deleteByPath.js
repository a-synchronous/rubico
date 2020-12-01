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
  if (object == null) {
    return undefined
  }
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
  const property = pathArray[index]
  if (result != null && property in result) {
    delete result[property]
  }
  return undefined
}

module.exports = deleteByPath
