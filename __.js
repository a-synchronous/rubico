const __ = require('./_internal/placeholder')

/**
 * @name __
 *
 * @synopsis
 * ```coffeescript [specscript]
 * __ Symbol(placeholder)
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
 *
 * See also:
 *  * [eq](/docs/eq)
 *  * [thunkify](/docs/thunkify)
 *  * [always](/docs/always)
 *  * [curry](/docs/curry)
 *  * [curry.arity](/docs/curry.arity)
 *  * [Transducer.map](/docs/Transducer.map)
 *
 */

module.exports = __
