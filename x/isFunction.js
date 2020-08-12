const { isFunction } = require('../monad/Instance')

/*
 * @name isFunction
 *
 * @synopsis
 * isFunction(x any) -> boolean
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
module.exports = isFunction
