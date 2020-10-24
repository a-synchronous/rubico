/**
 * @name identity
 *
 * @synopsis
 * ```coffeescript [specscript]
 * identity(value any) -> value
 * ```
 *
 * @description
 * Pass a value and receive the same value back.
 *
 * ```javascript [playground]
 * console.log(
 *   identity(1),
 * ) // 1
 * ```
 */
const identity = value => value

module.exports = identity
