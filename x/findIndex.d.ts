export = findIndex;
/**
 * @name findIndex
 *
 * @synopsis
 * ```coffeescript [specscript]
 * findIndex(predicate function)(array Array) -> index Promise|number
 * ```
 *
 * @description
 * Returns the index of the first element in an array that satisfies the predicate. Returns -1 if no element satisfies the predicate.
 *
 * ```javascript [playground]
 * import findIndex from 'https://unpkg.com/rubico/dist/x/findIndex.es.js'
 *
 * const oddNumberIndex = findIndex(function isOdd(number) {
 *   return number % 2 == 1
 * })([2, 3, 5])
 *
 * console.log(oddNumberIndex) // 1
 * ```
 *
 * @since 1.6.26
 */
declare function findIndex(predicate: any): (array: any) => any;
