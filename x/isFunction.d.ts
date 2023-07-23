export = isFunction;
/**
 * @name isFunction
 *
 * @synopsis
 * ```coffeescript [specscript]
 * isFunction(value any) -> boolean
 * ```
 *
 * @description
 * Determine whether a value is a function.
 *
 * ```javascript [playground]
 * import isFunction from 'https://unpkg.com/rubico/dist/x/isFunction.es.js'
 *
 * const add = (a, b) => a + b
 *
 * console.log(
 *   isFunction(add),
 * ) // true
 * ```
 */
declare function isFunction(value: any): boolean;
