export = has;
/**
 * @name has
 *
 * @synopsis
 * ```coffeescript [specscript]
 * has(key any)(container Set|Map|{ has: function }|Object) -> Promise|boolean
 * ```
 *
 * @description
 * Check if a collection has a key.
 *
 * ```javascript [playground]
 * import has from 'https://unpkg.com/rubico/dist/x/has.es.js'
 *
 * console.log(
 *   has('a')({ a: 1, b: 2, c: 3 }),
 * ) // true
 *
 * console.log(
 *   has('a')({}),
 * ) // false
 * ```
 */
declare function has(key: any): (container: any) => any;
