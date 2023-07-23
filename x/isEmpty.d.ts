export = isEmpty;
/**
 * @name isEmpty
 *
 * @synopsis
 * ```coffeescript [specscript]
 * isEmpty(value any) -> boolean
 * ```
 *
 * @description
 * Check if a value is empty.
 *
 * ```javascript [playground]
 * import isEmpty from 'https://unpkg.com/rubico/dist/x/isEmpty.es.js'
 *
 * console.log('', isEmpty('')) // true
 * console.log([], isEmpty([])) // true
 * console.log({}, isEmpty({})) // true
 * console.log([1, 2, 3], isEmpty([1, 2, 3])) // false
 * console.log(new Set([1, 2, 3]), isEmpty(new Set([1, 2, 3]))) // false
 * console.log({ a: 1, b: 2, c: 3 }, isEmpty({ a: 1, b: 2, c: 3 })) // false
 * ```
 */
declare function isEmpty(value: any): boolean;
