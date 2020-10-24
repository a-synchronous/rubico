/**
 * @name noop
 *
 * @synopsis
 * ```coffeescript [specscript]
 * noop() -> undefined
 * ```
 *
 * @description
 * Doesn't do anything.
 *
 * ```javascript [playground]
 * console.log(
 *   noop(),
 * ) // undefined
 * ```
 */
const noop = function noop() {}

module.exports = noop
