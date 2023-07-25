export = when;
/**
 * @name when
 *
 * @synopsis
 * ```coffeescript [specscript]
 * when(
 *   predicate any=>Promise|boolean,
 *   func function,
 * )(value any) -> Promise|any
 * ```
 *
 * @description
 * Execute a function and return the result when a condition is true, otherwise return the original value.
 *
 * ```javascript [playground]
 * import when from 'https://unpkg.com/rubico/dist/x/when.es.js'
 *
 * const isEven = num => num % 2 === 0
 * const doubleIfEven = when(isEven, num => num * 2)
 *
 * console.log(doubleIfEven(100)) // 200
 * console.log(doubleIfEven(101)) // 101
 * ```
 *
 * @since 1.7.1
 */
declare function when(predicate: any, func: any): (value: any) => any;
