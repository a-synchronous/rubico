const __ = require('./_internal/placeholder')

/**
 * @name __
 *
 * @synopsis
 * ```coffeescript [specscript]
 * __ = Symbol(placeholder)
 * ```
 *
 * @description
 * A special placeholder value that denotes the position of arguments in a curried function.
 *
 * ```javascript [playground]
 * console.log(
 *   curry.arity(3, Array.of, __, 2, 3)(1),
 * ) // [1, 2, 3]
 * ```
 */

module.exports = __
