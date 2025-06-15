const __ = require('./_internal/placeholder')
const curry2 = require('./_internal/curry2')
const FilteringIterator = require('./_internal/FilteringIterator')
const FilteringAsyncIterator = require('./_internal/FilteringAsyncIterator')
const isArray = require('./_internal/isArray')
const isPromise = require('./_internal/isPromise')
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
 * type Filterable = Array|Set|Map|Generator|AsyncGenerator|{ filter: function }|Object
 *
 * type SyncOrAsyncPredicate = (
 *   value any,
 *   indexOrKey number|string|any,
 *   filterable Filterable,
 * )=>(condition Promise|boolean)
 *
 * filter(filterable Promise|Filterable, predicate SyncOrAsyncPredicate) -> result Promise|Filterable
 * filter(predicate SyncOrAsyncPredicate)(filterable Filterable) -> result Promise|Filterable
 * ```
 *
 * @description
 * Filters out elements from a filterable. Returns a filterable of the same type. The order of the elements in the filterable is preserved.
 *
 * The following data types are considered to be filterables:
 *  * `array`
 *  * `set`
 *  * `map`
 *  * `generator`
 *  * `async generator`
 *  * `object with .filter method`
 *  * `object`
 *
 * The filtering operation is defined by a given predicate function. The predicate function dictates whether a given element from the filterable should be included in the returned filterable.
 *
 * ```javascript
 * const predicate = function (element) {
 *   // condition is the boolean result of the predicate test on element
 *   return condition
 * }
 * ```
 *
 * The predicate function signature changes depending on the provided filterable.
 *
 * If the filterable is an array:
 * ```coffeescript [specscript]
 * predicate(element any, index number, filt Array) -> condition Promise|boolean|any
 * ```
 *
 * If the filterable is a set:
 * ```coffeescript [specscript]
 * predicate(element any, element any, filt Set) -> condition Promise|boolean|any
 * ```
 *
 * If the filterable is a map:
 * ```coffeescript [specscript]
 * predicate(element any, key any, filt Map) -> condition Promise|boolean|any
 * ```
 *
 * If the filterable is a generator:
 * ```coffeescript [specscript]
 * predicate(element any) -> condition Promise|boolean|any
 * ```
 *
 * If the filterable is an async generator:
 * ```coffeescript [specscript]
 * predicate(element any) -> condition Promise|boolean|any
 * ```
 *
 * If the filterable is an object with a `.filter` method, the predicate function signature is defined externally.
 *
 * If the filterable is a plain object:
 * ```coffeescript [specscript]
 * predicate(element any, key string, filt Object) -> condition Promise|boolean|any
 * ```
 *
 * `filter` works for arrays.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const array = [1, 2, 3, 4, 5]
 *
 * const result = filter(array, isOdd)
 * console.log(result) // [1, 3, 5]
 * ```
 *
 * If the predicate is asynchronous, the returned promise is concurrently resolved for its boolean condition before continuing with the filtering operation.
 *
 * ```javascript [playground]
 * const asyncIsOdd = async number => number % 2 == 1
 *
 * const array = [1, 2, 3, 4, 5]
 *
 * const promise = filter(array, asyncIsOdd)
 * promise.then(console.log) // [1, 3, 5]
 * ```
 *
 * `filter` applies the predicate function to just the values of an object.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 }
 *
 * const result = filter(obj, isOdd)
 * console.log(result) // { a: 1, c: 3, e: 5 }
 * ```
 *
 * `filter` applies the predicate to the values of the entries of a map.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const myMap = new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]])
 *
 * const result = filter(myMap, isOdd)
 * console.log(result) // Map(3) { 'a' => 1, 'c' => 3, 'e' => 5 }
 * ```
 *
 * For generators, `filter` returns a lazily filtered generator. All values that are normally yielded by the generator that test false by the predicate are excluded from the returned generator.
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
 * ```
 *
 * For async generators, `filter` returns a lazily filtered async generator. All values that are normally yielded by the async generator that test falsy by the predicate are excluded from the returned async generator.
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
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * filter(Promise.resolve([1, 2, 3, 4, 5]), isOdd).then(console.log)
 * // [1, 3, 5]
 * ```
 *
 * See also:
 *  * [forEach](/docs/forEach)
 *  * [map](/docs/map)
 *  * [reduce](/docs/reduce)
 *  * [transform](/docs/transform)
 *  * [flatMap](/docs/flatMap)
 *  * [some](/docs/some)
 *
 * @execution concurrent
 *
 * @transducing
 */
const filter = function (arg0, arg1) {
  if (typeof arg0 == 'function') {
    return curry2(_filter, __, arg0)
  }
  return isPromise(arg0)
    ? arg0.then(curry2(_filter, __, arg1))
    : _filter(arg0, arg1)
}

module.exports = filter
