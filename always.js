const always = require('./_internal/always')

/**
 * @name always
 *
 * @synopsis
 * ```coffeescript [specscript]
 * always(value any) -> getter ()=>value
 * ```
 *
 * @description
 * Create a function that always returns a value.
 *
 * ```javascript [playground]
 * const always5 = always(5)
 *
 * console.log(always5()) // 5
 *
 * console.log(
 *   fork({
 *     a: always(1),
 *     b: always(2),
 *     c: always(3),
 *   })(),
 * ) // { a: 1, b: 2, c: 3 }
 * ```
 */

module.exports = always
