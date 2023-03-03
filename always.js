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
 * Creates a function from a value that always returns the provided value.
 *
 * ```javascript [playground]
 * const always5 = always(5)
 *
 * console.log(always5()) // 5
 * console.log(always5()) // 5
 * console.log(always5()) // 5
 * ```
 */

module.exports = always
