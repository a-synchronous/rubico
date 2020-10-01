/**
 * @name isObject
 *
 * @synopsis
 * ```coffeescript [specscript]
 * isObject(value any) -> boolean
 * ```
 *
 * @description
 * Determine whether a value is a direct `Object`.
 *
 * ```javascript [node]
 * console.log(
 *   isObject({ a: 1, b: 2, c: 3 }),
 * ) // true
 *
 * console.log(
 *   isObject('hey'),
 * ) // false
 *
 * console.log(
 *   isObject(new Set([1, 2, 3])),
 * ) // false
 * ```
 */
const isObject = value => value != null && value.constructor == Object

module.exports = isObject
