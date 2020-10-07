/**
 * @name isObject
 *
 * @synopsis
 * isObject(value any) -> boolean
 *
 * @description
 * Determine whether a value is an object. Note that Arrays are also objects in JS.
 */
const isObject = value => {
  if (value == null) {
    return false
  }

  return (typeof value == 'object') || (typeof value == 'function')
}

module.exports = isObject
