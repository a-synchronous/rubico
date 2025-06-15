export = size;
/**
 * @name size
 *
 * @synopsis
 * ```coffeescript [specscript]
 * size(value any) -> number
 * ```
 *
 * @description
 * Get the count of elements in a value.
 *
 * ```javascript [playground]
 * import size from 'https://unpkg.com/rubico/dist/x/size.es.js'
 *
 * console.log(size([1, 2, 3])) // 3
 * console.log(size('hey')) // 3
 * console.log(size(new Set([1, 2, 3]))) // 3
 * ```
 */
declare function size(value: any): any;
