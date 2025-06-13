export = groupBy;
/**
 * @name groupBy
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Reducer<T> = (any, T)=>Promise|any
 * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: Reducer<T>=>any }|Object<T>
 *
 * var property any,
 *   resolver any=>Promise|any,
 *   value Foldable
 *
 * groupBy(property)(value) -> groupedByProperty Map<any=>Array>
 *
 * groupBy(resolver)(value) -> groupedByResolver Promise|Map<any=>Array>
 * ```
 *
 * @description
 * Group a foldable collection into a Map of arrays by a property on each of its elements.
 *
 * ```javascript [playground]
 * import groupBy from 'https://unpkg.com/rubico/dist/x/groupBy.es.js'
 *
 * console.log(
 *   groupBy('age')([
 *     { name: 'John', age: 22 },
 *     { name: 'Jane', age: 22 },
 *     { name: 'Henry', age: 23 },
 *   ]),
 * )
 * // Map {
 * //   22 => [{ name: 'John', age: 22 }, { name: 'Jane', age: 22 }],
 * //   23 => [{ name: 'Henry', age: 23 }],
 * // }
 * ```
 *
 * Additionally, pass a resolver in property position to resolve a value for group membership for each item.
 *
 * ```javascript [playground]
 * import groupBy from 'https://unpkg.com/rubico/dist/x/groupBy.es.js'
 *
 * console.log(
 *   groupBy(
 *     word => word.toLowerCase(),
 *   )(['Hello', 'hello', 'Hey']),
 * ) // Map { 'hello' => ['Hello', 'hello'], 'hey' => ['Hey'] }
 * ```
 */
declare function groupBy(propertyOrResolver: any): any;
