const isObject = require('./isObject')
const getByPath = require('./getByPath')
const propertyPathToArray = require('./propertyPathToArray')

/**
 * @name setByPath
 *
 * @synopsis
 * ```coffeescript [specscript]
 * setByPath<
 *   obj any,
 *   value any,
 *   path string|number|Array<string|number>,
 * >(obj, value, path) -> obj any
 * ```
 */
const setByPath = function (obj, value, path) {
  if (!isObject(obj)){
    return obj
  }
  let index = -1
  const pathArray = propertyPathToArray(path)
  const pathLength = pathArray.length

  const result = { ...obj }
  let nested = result
  while (nested != null && ++index < pathLength){
    const pathKey = pathArray[index]
    if (index == (pathLength - 1)){
      nested[pathKey] = value
    } else {
      const value = getByPath(nested, pathKey)
      if (value) {
        nested = value
      } else {
        nested[pathKey] = {}
        nested = nested[pathKey]
      }
    }
  }

  return result
}

module.exports = setByPath
