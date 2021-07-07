const isArray = require('./isArray')
const isObject = require('./isObject')
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
  const pathArray = propertyPathToArray(path)
  const pathLength = pathArray.length
  const lastIndex = pathLength - 1
  const result = { ...obj }
  let nested = result
  let index = -1
  while (++index < pathLength){
    const pathKey = pathArray[index]
    if (index == lastIndex){
      nested[pathKey] = value
    } else {
      const existingNextNested = nested[pathKey]
      const nextNested = isArray(existingNextNested)
        ? existingNextNested.slice() : { ...existingNextNested }
      nested[pathKey] = nextNested
      nested = nextNested
    }
  }
  return result
}

module.exports = setByPath
