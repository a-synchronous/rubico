export = forEach;
/**
 * @name forEach
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Collection = Array|Iterable|AsyncIterable|{ forEach: function }|Object
 *
 * forEach(collection Collection, callback function) -> collection Collection
 *
 * forEach(callback function)(collection Collection) -> collection Collection
 * ```
 *
 * @description
 * Execute a callback for each item of a collection, returning a Promise if the execution is asynchronous.
 *
 * ```javascript [playground]
 * forEach([1, 2, 3, 4, 5l], console.log) // 1 2 3 4 5
 *
 * forEach({ a: 1, b: 2, c: 3 }, console.log) // 1 2 3
 * ```
 *
 * Omit the data argument for a composable API
 *
 * ```javascript [playground]
 * pipe([1, 2, 3, 4, 5], [
 *   filter(number => number % 2 == 1),
 *   map(number => number ** 2),
 *   forEach(console.log), // 1
 *                         // 9
 *                         // 25
 * ])
 * ```
 */
declare function forEach(...args: any[]): any;
