export = unless;
/**
 * @name unless
 *
 * @synopsis
 * ```coffeescript [specscript]
 * unless(
 *   predicate any=>Promise|boolean,
 *   func function,
 * )(value any) -> Promise|any
 * ```
 *
 * @description
 * Execute a function and return the result unless a condition is true, otherwise return the original value.
 *
 * ```javascript [playground]
 * import unless from 'https://unpkg.com/rubico/dist/x/unless.es.js'
 *
 * const isEven = num => num % 2 === 0
 * const doubleIfOdd = unless(isEven, num => num * 2)
 *
 * console.log(doubleIfOdd(100)) // 100
 * console.log(doubleIfOdd(101)) // 202
 * ```
 *
 * @since 1.7.3
 */
declare function unless(predicate: any, func: any): (value: any) => any;
