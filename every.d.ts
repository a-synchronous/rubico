export = every;
/**
 * @name every
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Foldable = Array|Iterable|AsyncIterable|{ reduce: function }|Object
 *
 * every(collection Foldable, predicate function) -> result Promise|boolean
 *
 * every(predicate function)(collection Foldable) -> result Promise|boolean
 * ```
 *
 * @description
 * Test a predicate concurrently across all items of a collection, returning true if all predications are truthy.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * console.log(
 *   every([1, 2, 3, 4, 5], isOdd),
 * ) // false
 *
 * console.log(
 *   every([1, 3, 5], isOdd),
 * ) // true
 * ```
 *
 * The collection can be any iterable, async iterable, or object values iterable collection. Below is an example of `every` accepting an async generator as the collection.
 *
 * ```javascript [playground]
 * const asyncNumbers = async function* () {
 *   yield 1; yield 2; yield 3; yield 4; yield 5
 * }
 *
 * every(asyncNumbers(), async number => number < 6).then(console.log) // true
 * ```
 *
 * `every` supports a tacit API for composability.
 *
 * ```javascript [playground]
 * pipe([1, 2, 3], [
 *   every(number => number < 5),
 *   console.log, // true
 * ])
 * ```
 *
 * @execution concurrent
 *
 * @muxing
 */
declare function every(...args: any[]): any;
