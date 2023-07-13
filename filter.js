const __ = require('./_internal/placeholder')
const curry2 = require('./_internal/curry2')
const FilteringIterator = require('./_internal/FilteringIterator')
const FilteringAsyncIterator = require('./_internal/FilteringAsyncIterator')
const isArray = require('./_internal/isArray')
const arrayFilter = require('./_internal/arrayFilter')
const stringFilter = require('./_internal/stringFilter')
const setFilter = require('./_internal/setFilter')
const mapFilter = require('./_internal/mapFilter')
const objectFilter = require('./_internal/objectFilter')
const symbolIterator = require('./_internal/symbolIterator')
const symbolAsyncIterator = require('./_internal/symbolAsyncIterator')

/**
 * @name _filter
 *
 * @synopsis
 * ```coffeescript [specscript]
 * _filter(
 *   array Array,
 *   arrayPredicate (value any, index number, array Array)=>Promise|boolean
 * ) -> filteredArray Promise|Array
 *
 * _filter(
 *   object Object,
 *   objectPredicate (value any, key string, object Object)=>Promise|boolean
 * ) -> filteredObject Promise|Object
 *
 * _filter(
 *   set Set,
 *   setPredicate (value any, value, set Set)=>Promise|boolean
 * ) -> filteredSet Promise|Set
 *
 * _filter(
 *   map Map,
 *   mapPredicate (value any, key any, map Map)=>Promise|boolean
 * ) -> filteredMap Promise|Map
 *
 * _filter(
 *   generatorFunction GeneratorFunction,
 *   predicate (value any)=>Promise|boolean
 * ) -> filteringGeneratorFunction GeneratorFunction
 *
 * _filter(
 *   asyncGeneratorFunction AsyncGeneratorFunction,
 *   predicate (value any)=>Promise|boolean
 * ) -> filteringAsyncGeneratorFunction AsyncGeneratorFunction
 *
 * _filter(
 *   reducer Reducer,
 *   predicate (value any)=>Promise|boolean
 * ) -> filteringReducer Reducer
 * ```
 */
const _filter = function (value, predicate) {
  if (isArray(value)) {
    return arrayFilter(value, predicate)
  }
  if (value == null) {
    return value
  }

  if (typeof value == 'string' || value.constructor == String) {
    return stringFilter(value, predicate)
  }
  if (value.constructor == Set) {
    return setFilter(value, predicate)
  }
  if (value.constructor == Map) {
    return mapFilter(value, predicate)
  }
  if (typeof value.filter == 'function') {
    return value.filter(predicate)
  }
  if (typeof value[symbolIterator] == 'function') {
    return FilteringIterator(value[symbolIterator](), predicate)
  }
  if (typeof value[symbolAsyncIterator] == 'function') {
    return FilteringAsyncIterator(value[symbolAsyncIterator](), predicate)
  }
  if (value.constructor == Object) {
    return objectFilter(value, predicate)
  }
  return value
}

/**
 * @name filter
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Filterable = Array|Object|Set|Map|Iterator|AsyncIterator
 *
 * type Predicate = (
 *   value any,
 *   indexOrKey number|string,
 *   collection Filterable,
 * )=>boolean
 *
 * filter(collection Filterable, predicate Predicate) -> result Promise|Filterable
 * filter(predicate Predicate)(collection Filterable) -> result Promise|Filterable
 * ```
 *
 * @description
 * Filter out items from a collection based on the results of their concurrent executions with a synchronous or asynchronous predicate function. `filter` accepts the following collections:
 *
 *  * `Array`
 *  * `Object`
 *  * `Set`
 *  * `Map`
 *  * `Iterator`/`Generator`
 *  * `AsyncIterator`/`AsyncGenerator`
 *
 * For arrays (type `Array`), `filter` applies the predicate function to each item of the array, returning a new array containing only the items that tested truthy by the predicate. The order of the items is preserved. On each iteration, the predicate is passed the item, the index of the item, and a reference to the array.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const array = [1, 2, 3, 4, 5]
 *
 * console.log(filter(isOdd)(array)) // [1, 3, 5]
 * console.log(filter(array, isOdd)) // [1, 3, 5]
 * ```
 *
 * For objects (type `Object`), `filter` applies the predicate function to each value of the object, returning a new object containing only the values that tested truthy by the predicate. On each iteration, the predicate is passed the object value, the key of the object value, and a reference to the object.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 }
 *
 * console.log(filter(isOdd)(obj)) // { a: 1, c: 3, e: 5 }
 * console.log(filter(obj, isOdd)) // { a: 1, c: 3, e: 5 }
 * ```
 *
 * For sets (type `Set`), `filter` applies the predicate function to each item in the set, returning a new set containing only the items that tested truthy by the predicate. On each iteration, the predicate is passed the item, the same item as the key argument, and a reference to the set.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const set = new Set([1, 2, 3, 4, 5])
 *
 * console.log(filter(isOdd)(set)) // Set { 1, 3, 5 }
 * console.log(filter(set, isOdd)) // Set { 1, 3, 5 }
 * ```
 *
 * For maps (type `Map`), `filter` applies the predicate function to the value of each entry of the map, returning a new map containing only the entries where the values tested truthy by the predicate. The order of the entries are preserved. On each iteration, the predicate is passed the map value, the key of the value, and a reference to the map.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 }
 * const m = new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]])
 *
 * console.log(filter(isOdd)(m)) // Map(3) { 'a' => 1, 'c' => 3, 'e' => 5 }
 * console.log(filter(m, isOdd)) // Map(3) { 'a' => 1, 'c' => 3, 'e' => 5 }
 * ```
 *
 * For iterators (type `Iterator`) or generators (type `Generator`), `filter` returns a lazily filtered iterator/generator; all values that are normally yielded by the iterator/generator that test falsy by the predicate function are skipped by the lazily filtered iterator/generator. On each iteration, the predicate is passed the iteration value only.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const numbersGeneratorFunction = function* () {
 *   yield 1; yield 2; yield 3; yield 4; yield 5
 * }
 *
 * const numbersGenerator = numbersGeneratorFunction()
 * const oddNumbersGenerator = filter(numbersGeneratorFunction(), isOdd)
 * const oddNumbersGenerator2 = filter(isOdd)(numbersGeneratorFunction())
 *
 * for (const number of numbersGenerator) {
 *   console.log(number) // 1
 *                       // 2
 *                       // 3
 *                       // 4
 *                       // 5
 * }
 *
 * for (const number of oddNumbersGenerator) {
 *   console.log(number) // 1
 *                       // 3
 *                       // 5
 * }
 *
 * for (const number of oddNumbersGenerator2) {
 *   console.log(number) // 1
 *                       // 3
 *                       // 5
 * }
 * ```
 *
 * With asyncIterators (type `AsyncIterator`) or asyncGenerators (type `AsyncGenerator`), `filter` returns a lazily filtered asyncIterator/asyncGenerator; all values that are normally yielded by the asyncIterator/asyncGenerator that test falsy by the predicate function are skipped by the lazily filtered asyncIterator/asyncGenerator. On each iteration, the predicate is passed the iteration value only.
 *
 * ```javascript [playground]
 * const asyncIsOdd = async number => number % 2 == 1
 *
 * const asyncNumbersGeneratorFunction = async function* () {
 *   yield 1; yield 2; yield 3; yield 4; yield 5
 * }
 *
 * const asyncNumbersGenerator = asyncNumbersGeneratorFunction()
 *
 * const asyncOddNumbersGenerator = filter(asyncNumbersGeneratorFunction(), asyncIsOdd)
 *
 * const asyncOddNumbersGenerator2 = filter(asyncIsOdd)(asyncNumbersGeneratorFunction())
 *
 * for await (const number of asyncNumbersGenerator) {
 *   console.log(number) // 1
 *                       // 2
 *                       // 3
 *                       // 4
 *                       // 5
 * }
 *
 * for await (const number of asyncOddNumbersGenerator) {
 *   console.log(number) // 1
 *                       // 3
 *                       // 5
 * }
 *
 * for await (const number of asyncOddNumbersGenerator2) {
 *   console.log(number) // 1
 *                       // 3
 *                       // 5
 * }
 * ```
 *
 * @execution concurrent
 *
 * @transducing
 */

const filter = function (...args) {
  const predicate = args.pop()
  if (args.length == 0) {
    return curry2(_filter, __, predicate)
  }
  return _filter(args[0], predicate)
}

module.exports = filter
