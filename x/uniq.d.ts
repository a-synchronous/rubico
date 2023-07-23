export = uniq;
/**
 * @name uniq
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var T any,
 *   array Array<T>
 *
 * uniq(array) -> Array
 * ```
 *
 * @description
 * Get an array of unique values from an array.
 *
 * ```javascript [playground]
 * import uniq from 'https://unpkg.com/rubico/dist/x/uniq.es.js'
 *
 * console.log(
 *   uniq([1, 2, 2, 3]),
 * ) // [1, 2, 3]
 * ```
 */
declare function uniq(arr: any): any[];
