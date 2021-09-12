const FilteringIterator = require('./_internal/FilteringIterator')
const FilteringAsyncIterator = require('./_internal/FilteringAsyncIterator')
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
const symbolIterator = require('./_internal/symbolIterator')
const symbolAsyncIterator = require('./_internal/symbolAsyncIterator')

/**
 * @name filter
 *
 * @catchphrase
 * exclude items by predicate
 *
 * @synopsis
 * ```coffeescript [specscript]
 * filter(
 *   arrayPredicate (value any, index number, array Array)=>Promise|boolean
 * )(array) -> filteredArray Promise|Array
 *
 * filter(
 *   objectPredicate (value any, key string, object Object)=>Promise|boolean
 * )(object) -> filteredObject Promise|Object
 *
 * filter(
 *   setPredicate (value any, value, set Set)=>Promise|boolean
 * )(set) -> filteredSet Promise|Set
 *
 * filter(
 *   mapPredicate (value any, key any, map Map)=>Promise|boolean
 * )(map) -> filteredMap Promise|Map
 *
 * filter(
 *   predicate (value any)=>Promise|boolean
 * )(generatorFunction GeneratorFunction) -> filteringGeneratorFunction GeneratorFunction
 *
 * filter(
 *   predicate (value any)=>Promise|boolean
 * )(asyncGeneratorFunction AsyncGeneratorFunction) -> filteringAsyncGeneratorFunction AsyncGeneratorFunction
 *
 * filter(
 *   predicate (value any)=>Promise|boolean
 * )(reducer Reducer) -> filteringReducer Reducer
 * ```
 *
 * @description
 * Filter out items from a filterable based on the results of their concurrent executions with a predicate. `filter` recognizes several vanilla JavaScript types as filterables.
 *
 *  * `Array` - filter array items by predicate
 *  * `Object` - filter object values by predicate
 *  * `Set` - filter Set values by predicate
 *  * `Map` - filter Map values by predicate (not entries)
 *  * `Iterator` - skip iterations by predicate
 *  * `AsyncIterator` - skip async iterations by predicate
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
 *
 * console.log(
 *   filter(isOdd)(new Set([1, 2, 3, 4, 5])),
 * ) // Set { 1, 3, 5 }
 * ```
 *
 * Passing a generator function to `filter` in filterable position returns a generator function that produces filtering generators; all values that are normally yielded by a generator that test falsy by the predicate are skipped by a filtering generator.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const numbersGeneratorFunction = function* () {
 *   yield 1; yield 2; yield 3; yield 4; yield 5
 * }
 *
 * const oddNumbersGeneratorFunction = filter(isOdd)(numbersGeneratorFunction)
 *
 * for (const number of oddNumbersGeneratorFunction()) {
 *   console.log(number) // 1
 *                       // 3
 *                       // 5
 * }
 *
 * const oddNumbersGenerator = filter(isOdd)(numbersGeneratorFunction())
 *
 * for (const number of oddNumbersGenerator) {
 *   console.log(number) // 1
 *                       // 3
 *                       // 5
 * }
 * ```
 *
 * In a similar vein to generator functions, passing an async generator function in filterable position creates an async generator function of filtered async generators. Each filtered async generator skips async iterations with values that test falsy by the predicate.
 *
 * ```javascript [playground]
 * const asyncIsOdd = async number => number % 2 == 1
 *
 * const asyncNumbersGeneratorFunction = async function* () {
 *   yield 1; yield 2; yield 3; yield 4; yield 5
 * }
 *
 * const asyncOddNumbersGeneratorFunction = filter(asyncIsOdd)(asyncNumbersGeneratorFunction)
 *
 * for await (const number of asyncOddNumbersGeneratorFunction()) {
 *   console.log(number) // 1
 *                       // 3
 *                       // 5
 * }
 *
 * const asyncOddNumbersGenerator = filter(asyncIsOdd)(asyncNumbersGeneratorFunction())
 *
 * for await (const number of asyncOddNumbersGenerator) {
 *   console.log(number) // 1
 *                       // 3
 *                       // 5
 * }
 * ```
 *
 * A reducer in filterable position creates a filtering reducer - one that skips items of the reducer's reducing operation if they test falsy by the predicate. It is possible to use an asynchronous predicate when filtering a reducer, however the implementation of `reduce` must support asynchronous operations. This library provides such an implementation as `reduce`.
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
  if (typeof value.filter == 'function') {
    return value.filter(predicate)
  }
  if (value.constructor == Object) {
    return objectFilter(value, predicate)
  }
  if (typeof value[symbolIterator] == 'function') {
    return FilteringIterator(value[symbolIterator](), predicate)
  }
  if (typeof value[symbolAsyncIterator] == 'function') {
    return FilteringAsyncIterator(value[symbolAsyncIterator](), predicate)
  }
  return value
}

/**
 * @name filter.withIndex
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var T any,
 *   index number,
 *   array Array<T>,
 *   indexedPredicate (T, index, array)=>Promise|boolean
 *
 * filter.withIndex(indexedPredicate)(array) -> Array<T>
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
