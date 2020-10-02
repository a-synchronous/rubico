/**
 * @name isFunction
 *
 * @synopsis
 * ```coffeescript [specscript]
 * isFunction(value any) -> boolean
 * ```
 *
 * @description
 * Determine whether a value is a function.
 *
 * ```javascript [node]
 * const add = (a, b) => a + b
 *
 * console.log(
 *   isFunction(add),
 * ) // true
 * ```
 */
const isFunction = value => typeof value == 'function'

module.exports = isFunction
