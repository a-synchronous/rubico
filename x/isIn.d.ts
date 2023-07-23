export = isIn;
/**
 * @name isIn
 *
 * @synopsis
 * ```coffeescript [specscript]
 * isIn(container Array|Object|String|Set|Map)(value any) -> boolean
 * ```
 *
 * @description
 * Counterpart to includes. Check if a collection includes another value.
 *
 * ```javascript [playground]
 * import isIn from 'https://unpkg.com/rubico/dist/x/isIn.es.js'
 *
 * console.log(
 *   isIn([1, 2, 3](1)
 * ) // true
 *
 * console.log(
 *   isIn([1, 2, 3](4)
 * ) // false
 *
 * console.log(
 *   isIn({ a: 1 })(1)
 * ) // true
 *
 * console.log(
 *   isIn({ a: 1 })(2)
 * ) // true
 *
 * console.log(
 *   isIn('abc')('a')
 * ) // true
 *
 * console.log(
 *   isIn('abc')('ab')
 * ) // true
 *
 * console.log(
 *   isIn('abc')('d')
 * ) // false
 *
 * console.log(
 *   isIn(new Set([1, 2, 3]))(1)
 * ) // true
 *
 * console.log(
 *   isIn(new Set([1, 2, 3]))(4)
 * ) // false
 *
 * console.log(
 *   isIn(new Map([[1, 1], [2, 2], [3, 3]]))(1)
 * ) // true
 *
 * console.log(
 *   isIn(new Map([[1, 1], [2, 2], [3, 3]]))(4)
 * ) // false
 * ```
 */
declare function isIn(...args: any[]): any;
