const isArray = require('../_internal/isArray')
const sameValueZero = require('../_internal/sameValueZero')

// (object Object, value any) -> boolean
const objectIncludes = function (object, value) {
  for (const key in object) {
    if (sameValueZero(value, object[key])) {
      return true
    }
  }
  return false
}

/**
 * @name includes
 *
 * @synopsis
 * ```coffeescript [specscript]
 * includes(value any)(container Array|String|Object) -> boolean
 * ```
 *
 * @description
 * Check if a collection includes another value by [SameValueZero](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero).
 *
 * ```javascript [playground]
 * import includes from 'https://unpkg.com/rubico/dist/x/includes.es.js'
 *
 * console.log(
 *   includes(5)([1, 2, 3, 4, 5])
 * ) // true
 *
 * console.log(
 *   includes(5)([1, 2, 3])
 * ) // false
 * ```
 */
const includes = value => function includesValue(container) {
  if (container == null) {
    return false
  }
  if (typeof container.includes == 'function') {
    return container.includes(value)
  }
  if (container.constructor == Object) {
    return objectIncludes(container, value)
  }
  return false
}

module.exports = includes
