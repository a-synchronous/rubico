export = first;
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
 * Get the first element of a collection
 *
 * ```javascript [playground]
 * import first from 'https://unpkg.com/rubico/dist/x/first.es.js'
 *
 * console.log(first([1, 2, 3])) // 1
 * console.log(first('abc')) // 'a'
 * console.log(first([])) // undefined
 * ```
 */
declare function first(value: any): any;
