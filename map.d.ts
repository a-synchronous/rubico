export = map;
/**
 * @name map
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Mappable = Array|Object|Set|Map|Iterator|AsyncIterator
 *
 * type Mapper = (
 *   value any,
 *   indexOrKey number|string,
 *   collection Mappable
 * )=>(mappedElement Promise|any)
 *
 * map(value Mappable, mapper Mapper) -> result Promise|Mappable
 * map(mapper Mapper)(value Mappable) -> result Promise|Mappable
 * ```
 *
 * @description
 * Applies a synchronous or asynchronous mapper function concurrently to each element of a collection, returning the results in a new collection of the same type. If order is implied by the collection, it is maintained in the result. `map` accepts the following collections:
 *
 *  * `Array`
 *  * `Object`
 *  * `Set`
 *  * `Map`
 *  * `Iterator`/`Generator`
 *  * `AsyncIterator`/`AsyncGenerator`
 *
 * With arrays (type `Array`), `map` applies the mapper function to each element of the array, returning the transformed results in a new array ordered the same as the original array.
 *
 * ```javascript [playground]
 * const square = number => number ** 2
 *
 * const array = [1, 2, 3, 4, 5]
 *
 * console.log(
 *   map(array, square)
 * ) // [1, 4, 9, 16, 25]
 *
 * console.log(
 *   map(square)(array)
 * ) // [1, 4, 9, 16, 25]
 * ```
 *
 * With objects (type `Object`), `map` applies the mapper function to each value of the object, returning the transformed results as values in a new object ordered by the keys of the original object
 *
 * ```javascript [playground]
 * const square = number => number ** 2
 *
 * const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 }
 *
 * console.log(
 *   map(square)(obj)
 * ) // { a: 1, b: 4, c: 9, d: 16, e: 25 }
 *
 * console.log(
 *   map(obj, square)
 * ) // { a: 1, b: 4, c: 9, d: 16, e: 25 }
 * ```
 *
 * With sets (type `Set`), `map` applies the mapper function to each value of the set, returning the transformed results unordered in a new set.
 *
 * ```javascript [playground]
 * const square = number => number ** 2
 *
 * const set = new Set([1, 2, 3, 4, 5])
 *
 * console.log(
 *   map(set, square)
 * ) // [1, 4, 9, 16, 25]
 *
 * console.log(
 *   map(square)(set)
 * ) // [1, 4, 9, 16, 25]
 * ```
 *
 * With maps (type `Map`), `map` applies the mapper function to each value of the map, returning the results at the same keys in a new map. The entries of the resulting map are in the same order as those of the original map
 *
 * ```javascript [playground]
 * const square = number => number ** 2
 *
 * const m = new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]])
 *
 * console.log(
 *   map(square)(m)
 * ) // Map { 'a' => 1, 'b' => 4, 'c' => 9, 'd' => 16, 'e' => 25 }
 *
 * console.log(
 *   map(m, square)
 * ) // Map { 'a' => 1, 'b' => 4, 'c' => 9, 'd' => 16, 'e' => 25 }
 * ```
 *
 * With iterators (type `Iterator`) or generators (type `Generator`), `map` applies the mapper function lazily to each value of the iterator/generator, creating a new iterator with transformed iterations.
 *
 * ```javascript [playground]
 * const capitalize = string => string.toUpperCase()
 *
 * const abcGeneratorFunc = function* () {
 *   yield 'a'; yield 'b'; yield 'c'
 * }
 *
 * const abcGenerator = abcGeneratorFunc()
 * const ABCGenerator = map(abcGeneratorFunc(), capitalize)
 * const ABCGenerator2 = map(capitalize)(abcGeneratorFunc())
 *
 * console.log([...abcGenerator]) // ['a', 'b', 'c']
 *
 * console.log([...ABCGenerator]) // ['A', 'B', 'C']
 *
 * console.log([...ABCGenerator2]) // ['A', 'B', 'C']
 * ```
 *
 * With asyncIterators (type `AsyncIterator`, or `AsyncGenerator`), `map` applies the mapper function lazily to each value of the asyncIterator, creating a new asyncIterator with transformed iterations
 *
 * ```javascript [playground]
 * const capitalize = string => string.toUpperCase()
 *
 * const abcAsyncGeneratorFunc = async function* () {
 *   yield 'a'; yield 'b'; yield 'c'
 * }
 *
 * const abcAsyncGenerator = abcAsyncGeneratorFunc()
 * const ABCGenerator = map(abcAsyncGeneratorFunc(), capitalize)
 * const ABCGenerator2 = map(capitalize)(abcAsyncGeneratorFunc())
 *
 * ;(async function () {
 *   for await (const letter of abcAsyncGenerator) {
 *     console.log(letter)
 *     // a
 *     // b
 *     // c
 *   }
 *
 *   for await (const letter of ABCGenerator) {
 *     console.log(letter)
 *     // A
 *     // B
 *     // C
 *   }
 *
 *   for await (const letter of ABCGenerator2) {
 *     console.log(letter)
 *     // A
 *     // B
 *     // C
 *   }
 * })()
 * ```
 *
 * @execution concurrent
 *
 * @TODO streamMap
 */
declare function map(...args: any[]): any;
declare namespace map {
    /**
     * @name map.entries
     *
     * @synopsis
     * ```coffeescript [specscript]
     * map.entries(
     *   mapper ([key any, value any])=>Promise|[any, any],
     * )(value Map|Object) -> Promise|Map|Object
     * ```
     *
     * @description
     * `map` over the entries rather than the values of a collection. Accepts collections of type `Map` or `Object`.
     *
     * ```javascript [playground]
     * const upperCaseKeysAndSquareValues =
     *   map.entries(([key, value]) => [key.toUpperCase(), value ** 2])
     *
     * console.log(upperCaseKeysAndSquareValues({ a: 1, b: 2, c: 3 }))
     * // { A: 1, B: 4, C: 9 }
     *
     * console.log(upperCaseKeysAndSquareValues(new Map([['a', 1], ['b', 2], ['c', 3]])))
     * // Map(3) { 'A' => 1, 'B' => 4, 'C' => 9 }
     * ```
     *
     * @since v1.7.0
     */
    function entries(mapper: any): (value: any) => any;
    /**
     * @name map.series
     *
     * @synopsis
     * ```coffeescript [specscript]
     * map.series(
     *   mapperFunc (value any, index number)=>Promise|any,
     * )(array Array) -> Promise|Array
     * ```
     *
     * @description
     * `map` with serial execution.
     *
     * ```javascript [playground]
     * const delayedLog = number => new Promise(function (resolve) {
     *   setTimeout(function () {
     *     console.log(number)
     *     resolve()
     *   }, 1000)
     * })
     *
     * console.log('start')
     * map.series(delayedLog)([1, 2, 3, 4, 5])
     * ```
     *
     * @execution series
     */
    function series(mapper: any, index: number): (value: any) => any;
    /**
     * @name map.pool
     *
     * @synopsis
     * ```coffeescript [specscript]
     * map.pool(
     *   maxConcurrency number,
     *   mapper (value any)=>Promise|any,
     * )(array Array) -> result Promise|Array
     * ```
     *
     * @description
     * `map` that specifies the maximum concurrency (number of ongoing promises at any time) of the execution. Only works for arrays.
     *
     * ```javascript [playground]
     * const ids = [1, 2, 3, 4, 5]
     *
     * const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
     *
     * const delayedIdentity = async value => {
     *   await sleep(1000)
     *   return value
     * }
     *
     * map.pool(2, pipe([
     *   delayedIdentity,
     *   console.log,
     * ]))(ids)
     * ```
     *
     * @TODO objectMapPool
     *
     * @execution concurrent
     */
    function pool(concurrencyLimit: any, mapper: any): (value: any) => any[] | Promise<any>;
}
