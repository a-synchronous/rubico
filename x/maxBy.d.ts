export = maxBy;
/**
 * @name maxBy
 *
 * @synopsis
 * ```coffeescript [specscript]
 * maxBy(array Array, path string) -> maxItemByPath any
 *
 * maxBy(path string)(array Array) -> maxItemByPath any
 * ```
 *
 * @description
 * Finds the item that is the max by a property denoted by path.
 *
 * ```javascript [playground]
 * import maxBy from 'https://unpkg.com/rubico/dist/x/maxBy.es.js'
 *
 * const array = [{ a: 1 }, { a: 2 }, { a: 3 }]
 *
 * const maxItem = maxBy(array, 'a')
 *
 * console.log(maxItem) // { a: 3 }
 * ```
 *
 * `maxBy` composes in a pointfree way.
 *
 * ```javascript [playground]
 * import maxBy from 'https://unpkg.com/rubico/dist/x/maxBy.es.js'
 *
 * const numbers = [1, 2, 3]
 *
 * const maxItem = pipe(numbers, [
 *   map(number => number ** 2),
 *   map(number => ({ a: { b: { c: number } } })),
 *   maxBy('a.b.c')
 * ])
 *
 * console.log(maxItem) // { a: { b: { c: 9 } } }
 * ```
 */
declare function maxBy(...args: any[]): any;
