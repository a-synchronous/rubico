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
 * import identity from 'https://unpkg.com/rubico/dist/x/identity.es.js'
 *
 * console.log(
 *   identity(1),
 * ) // 1
 * ```
 */
const identity = value => value

module.exports = identity
