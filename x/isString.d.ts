export = isString;
/**
 * @name isString
 *
 * @synopsis
 * ```coffeescript [specscript]
 * isString(value any) -> boolean
 * ```
 *
 * @description
 * Determine whether a value is a string.
 *
 * ```javascript [playground]
 * import isString from 'https://unpkg.com/rubico/dist/x/isString.es.js'
 *
 * console.log(
 *   isString('hey'),
 * ) // true
 * ```
 */
declare function isString(value: any): boolean;
