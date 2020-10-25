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
 * import noop from 'https://unpkg.com/rubico/dist/x/noop.es.js'
 *
 * console.log(
 *   noop(),
 * ) // undefined
 * ```
 */
const noop = function noop() {}

module.exports = noop
