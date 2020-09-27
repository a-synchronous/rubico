const FilteringIterator = require('./_internal/FilteringIterator')
const isArray = require('./_internal/isArray')
const isGeneratorFunction = require('./_internal/isGeneratorFunction')
const isAsyncGeneratorFunction = require('./_internal/isAsyncGeneratorFunction')
const arrayFilter = require('./_internal/arrayFilter')
const generatorFunctionFilter = require('./_internal/generatorFunctionFilter')
const asyncGeneratorFunctionFilter = require('./_internal/asyncGeneratorFunctionFilter')
const reducerFilter = require('./_internal/reducerFilter')
const stringFilter = require('./_internal/stringFilter')
const setFilter = require('./_internal/setFilter')
const mapFilter = require('./_internal/mapFilter')
const objectFilter = require('./_internal/objectFilter')
const arrayFilterWithIndex = require('./_internal/arrayFilterWithIndex')

/**
 * @name filter
 *
 * @catchphrase
 * exclude items by predicate
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Filterable<T> = Array<T>|Object<T>
 *   |Iterable<T>|AsyncIterable<T>|{ filter: T=>boolean }
 *
 * filter<T>(
 *   predicate T=>Promise|boolean,
 * )(value Filterable<T>) -> filtered Promise|Filterable<T>
 *
 * filter<T>(
 *   predicate T=>boolean, # note: only synchronous predicates allowed here
 * )(generatorFunction GeneratorFunction<T>)
 *   -> filteringGeneratorFunction GeneratorFunction<T>
 *
 * filter<T>(
 *   predicate T=>Promise|boolean,
 * )(asyncGeneratorFunction AsyncGeneratorFunction<T>)
 *   -> filteringAsyncGeneratorFunction AsyncGeneratorFunction<T>
 *
 * filter<T>(
 *   predicate T=>Promise|boolean,
 * )(reducer (any, T)=>Promise|any)
 *   -> filteringReducer (any, T)=>Promise|any
 * ```
 *
 * @description
 * Exclude items from a collection based on the results of their concurrent execution with the predicate. The predicate may be asynchronous.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * console.log(
 *   filter(isOdd)([1, 2, 3, 4, 5]),
 * ) // [1, 3, 5]
 *
 * console.log(
 *   filter(isOdd)({ a: 1, b: 2, c: 3, d: 4, e: 5 }),
 * ) // { a: 1, c: 3, e: 5 }
 * ```
 *
 * Passing a generator function to `filter` returns a filtering generator function; all values that are normally yielded by a generator function that test falsy with the predicate are skipped by the returned filtering generator function.
 *
 * **Warning**: usage of an async predicate with generator functions or iterators may lead to undesirable behavior.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const numbers = function* () {
 *   yield 1; yield 2; yield 3; yield 4; yield 5
 * }
 *
 * const oddNumbers = filter(isOdd)(numbers)
 *
 * for (const number of oddNumbers()) {
 *   console.log(number) // 1
 *                       // 3
 *                       // 5
 * }
 *
 * const oddNumbersGenerator = filter(isOdd)(numbers())
 *
 * for (const number of oddNumbersGenerator) {
 *   console.log(number) // 1
 *                       // 3
 *                       // 5
 * }
 * ```
 *
 * In a similar vein to generators, `filter` also filters elements from async generators.
 *
 * ```javascript [playground]
 * const asyncIsOdd = async number => number % 2 == 1
 *
 * const asyncNumbers = async function* () {
 *   yield 1; yield 2; yield 3; yield 4; yield 5
 * }
 *
 * const asyncOddNumbers = filter(asyncIsOdd)(asyncNumbers)
 *
 * for await (const number of asyncOddNumbers()) {
 *   console.log(number) // 1
 *                       // 3
 *                       // 5
 * }
 *
 * const asyncOddNumbersGenerator = filter(asyncIsOdd)(asyncNumbers())
 *
 * for await (const number of asyncOddNumbersGenerator) {
 *   console.log(number) // 1
 *                       // 3
 *                       // 5
 * }
 * ```
 *
 * Finally, `filter` creates filtering transducers. A reducer created from a filtering transducer skips items of a reducing operation if they test falsy under the predicate.
 *
 * Note: It is possible to use an asynchronous predicate when filtering a reducer, however the implementation of `reduce` must support asynchronous operations. This library provides such an implementation as `reduce`.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const concat = (array, item) => array.concat(item)
 *
 * const concatOddNumbers = filter(isOdd)(concat)
 *
 * console.log(
 *   [1, 2, 3, 4, 5].reduce(concatOddNumbers, []),
 * ) // [1, 3, 5]
 * ```
 *
 * @execution concurrent
 *
 * @transducing
 */
const filter = predicate => function filtering(value) {
  if (isArray(value)) {
    return arrayFilter(value, predicate)
  }
  if (typeof value == 'function') {
    if (isGeneratorFunction(value)) {
      return generatorFunctionFilter(value, predicate)
    }
    if (isAsyncGeneratorFunction(value)) {
      return asyncGeneratorFunctionFilter(value, predicate)
    }
    return reducerFilter(value, predicate)
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
  if (value.constructor == Object) {
    return objectFilter(value, predicate)
  }
  if (typeof value.next == 'function') {
    return FilteringIterator(value, predicate)
  }
  return typeof value.filter == 'function' ? value.filter(predicate) : value
}

/**
 * @name filter.withIndex
 *
 * @synopsis
 * ```coffeescript [specscript]
 * filter.withIndex(
 *   predicate T=>Promise|boolean,
 * )(value Array<T>) -> filteredArray Array<T>
 * ```
 *
 * @description
 * `filter` with each predicate call supplemented by index and reference to original collection.
 *
 * ```javascript [playground]
 * const uniq = filter.withIndex(
 *   (item, index, array) => item !== array[index + 1])
 *
 * console.log(
 *   uniq([1, 1, 1, 2, 2, 2, 3, 3, 3]),
 * ) // [1, 2, 3]
 * ```
 *
 * @execution concurrent
 */
filter.withIndex = predicate => function filteringWithIndex(value) {
  if (isArray(value)) {
    return arrayFilterWithIndex(value, predicate)
  }
  throw new TypeError(`${value} is not an Array`)
}

module.exports = filter
