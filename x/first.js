/**
 * @name first
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var value Array|string
 *
 * first(value) -> any
 * ```
 *
 * @description
 * Get the first item of a collection
 *
 * ```javascript [playground]
 * import first from 'https://unpkg.com/rubico/dist/x/first.es.js'
 *
 * console.log(first([1, 2, 3])) // 1
 * console.log(first('abc')) // 'a'
 * console.log(first([])) // undefined
 * ```
 */
const first = value => value == null ? undefined : value[0]

module.exports = first
