/**
 * @name isFunction
 *
 * @synopsis
 * isFunction(value any) -> boolean
 *
 * @catchphrase
 * Tell if Function
 *
 * @description
 * `isFunction` accepts anything and returns true if that thing is a Function
 *
 * @example
 * const add = (a, b) => a + b
 *
 * console.log(
 *   isFunction(add),
 * ) // true
 */
const isFunction = value => typeof value == 'function'

module.exports = isFunction
