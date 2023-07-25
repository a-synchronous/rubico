export = unionWith;
/**
 * @name unionWith
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var T any,
 *   arrayOfArrays Array<Array<T>>,
 *   comparator (T, T)=>Promise|boolean
 *
 * unionWith(comparator)(arrayOfArrays) -> Array<T>
 * ```
 *
 * @description
 * Create an array of unique values from an array of arrays with uniqueness determined by a comparator. The comparator is a function that returns a boolean value, `true` if two given values are distinct.
 *
 * ```javascript [playground]
 * import isDeepEqual from 'https://unpkg.com/rubico/dist/x/isDeepEqual.es.js'
 * import unionWith from 'https://unpkg.com/rubico/dist/x/unionWith.es.js'
 *
 * console.log(
 *   unionWith(isDeepEqual)([
 *     [{ a: 1 }, { b: 2 }, { a: 1 }],
 *     [{ b: 2 }, { b: 2 }, { b: 2 }],
 *   ]),
 * ) // [{ a: 1 }, { b: 2 }]
 * ```
 *
 * @TODO setUnionWith
 */
declare function unionWith(comparator: any): (value: any) => any;
