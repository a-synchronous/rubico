const includes = require('./includes')
const curry2 = require('../_internal/curry2')
const __ = require('../_internal/placeholder')

/**
 * @name _isIn
 *
 * @synopsis
 * ```coffeescript [specscript]
 * _isIn(value any, container Array|Object|String|Set|Map) -> boolean
 * ```
 *
 * @description
 * Counterpart to includes. Check if a collection includes another value.
 *
 * ```javascript [playground]
 * import isIn from 'https://unpkg.com/rubico/dist/x/isIn.es.js'
 *
 * console.log(
 *   isIn(1, [1, 2, 3])
 * ) // true
 *
 * console.log(
 *   isIn(4, [1, 2, 3])
 * ) // false
 *
 * console.log(
 *   isIn(1, { a: 1 })
 * ) // true
 *
 * console.log(
 *   isIn(2, { a: 1 })
 * ) // true
 *
 * console.log(
 *   isIn('a', 'abc')
 * ) // true
 *
 * console.log(
 *   isIn('ab', 'abc')
 * ) // true
 *
 * console.log(
 *   isIn('d', 'abc')
 * ) // false
 *
 * console.log(
 *   isIn(1, new Set([1, 2, 3]))
 * ) // true
 *
 * console.log(
 *   isIn(4, new Set([1, 2, 3]))
 * ) // false
 *
 * console.log(
 *   isIn(1, new Map([[1, 1], [2, 2], [3, 3]]))
 * ) // true
 *
 * console.log(
 *   isIn(4, new Map([[1, 1], [2, 2], [3, 3]]))
 * ) // false
 * ```
 */
const _isIn = function (value, container) {
  if (container == null) {
    return false
  }
  if (container.constructor == Set) {
    return container.has(value)
  }
  if (container.constructor == Map) {
    return Array.from(container.values()).includes(value)
  }

  return includes(value)(container)
}


/**
 * @name isIn
 *
 * @synopsis
 * ```coffeescript [specscript]
 * isIn(container Array|Object|String|Set|Map)(value any) -> boolean
 * ```
 *
 * @description
 * Counterpart to includes. Check if a collection includes another value.
 *
 * ```javascript [playground]
 * import isIn from 'https://unpkg.com/rubico/dist/x/isIn.es.js'
 *
 * console.log(
 *   isIn([1, 2, 3](1)
 * ) // true
 *
 * console.log(
 *   isIn([1, 2, 3](4)
 * ) // false
 *
 * console.log(
 *   isIn({ a: 1 })(1)
 * ) // true
 *
 * console.log(
 *   isIn({ a: 1 })(2)
 * ) // true
 *
 * console.log(
 *   isIn('abc')('a')
 * ) // true
 *
 * console.log(
 *   isIn('abc')('ab')
 * ) // true
 *
 * console.log(
 *   isIn('abc')('d')
 * ) // false
 *
 * console.log(
 *   isIn(new Set([1, 2, 3]))(1)
 * ) // true
 *
 * console.log(
 *   isIn(new Set([1, 2, 3]))(4)
 * ) // false
 *
 * console.log(
 *   isIn(new Map([[1, 1], [2, 2], [3, 3]]))(1)
 * ) // true
 *
 * console.log(
 *   isIn(new Map([[1, 1], [2, 2], [3, 3]]))(4)
 * ) // false
 * ```
 */
const isIn = (...args) => {
  const container = args.pop()
  if (args.length > 0) {
    return _isIn(args[0], container)
  }
  return curry2(_isIn, __, container)
}

module.exports = isIn
