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
 * A special placeholder value `__` (two underscores) that denotes the position of an argument in a curried function.
 *
 * ```javascript [playground]
 * console.log(
 *   curry.arity(3, Array.of, __, 2, 3)(1),
 * ) // [1, 2, 3]
 * ```
 */

module.exports = __
