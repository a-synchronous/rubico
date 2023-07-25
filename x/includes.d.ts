export = includes;
/**
 * @name includes
 *
 * @synopsis
 * ```coffeescript [specscript]
 * includes(value any)(container Array|String|Object) -> boolean
 * ```
 *
 * @description
 * Check if a collection includes another value by [SameValueZero](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero).
 *
 * ```javascript [playground]
 * import includes from 'https://unpkg.com/rubico/dist/x/includes.es.js'
 *
 * console.log(
 *   includes(5)([1, 2, 3, 4, 5])
 * ) // true
 *
 * console.log(
 *   includes(5)([1, 2, 3])
 * ) // false
 * ```
 */
declare function includes(value: any): (container: any) => any;
