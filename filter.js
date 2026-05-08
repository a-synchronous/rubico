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
  if (typeof value[symbolIterator] == 'function') {
    return FilteringIterator(value[symbolIterator](), predicate)
  }
  if (typeof value[symbolAsyncIterator] == 'function') {
    return FilteringAsyncIterator(value[symbolAsyncIterator](), predicate)
  }
  if (typeof value.filter == 'function') {
    return value.filter(predicate)
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
 * )=>(booleanResult Promise|boolean|any)
 *
 * filter(filterable Promise|Filterable, predicate SyncOrAsyncPredicate) -> filteredFilterable Promise|Filterable
 * filter(predicate SyncOrAsyncPredicate)(filterable Filterable) -> filteredFilterable Promise|Filterable
 * ```
 *
 * @description
 * Filters out items from a filterable, returning a filtered filterable of the same type. The order of the items of the filterable is preserved.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const array = [1, 2, 3, 4, 5]
 *
 * const filteredArray = filter(array, isOdd)
 *
 * console.log(filteredArray)
 * ```
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
 * The filtering operation is defined by the predicate function, which determines whether a given item from the filterable should be included in the filtered filterable.
 *
 * ```javascript
 * const predicate = function (item) {
 *   // booleanResult is the boolean result of the predicate
 *   return booleanResult
 * }
 * ```
 *
 * The predicate function signature changes depending on the provided filterable.
 *
 * If the filterable is an array:
 * ```coffeescript [specscript]
 * predicate(item any, index number, filterable Array) -> booleanResult Promise|boolean|any
 * ```
 *
 * If the filterable is a set:
 * ```coffeescript [specscript]
 * predicate(item any, item any, filterable Set) -> booleanResult Promise|boolean|any
 * ```
 *
 * If the filterable is a map:
 * ```coffeescript [specscript]
 * predicate(item any, key any, filterable Map) -> booleanResult Promise|boolean|any
 * ```
 *
 * If the filterable is a generator:
 * ```coffeescript [specscript]
 * predicate(item any) -> booleanResult Promise|boolean|any
 * ```
 *
 * If the filterable is an async generator:
 * ```coffeescript [specscript]
 * predicate(item any) -> booleanResult Promise|boolean|any
 * ```
 *
 * If the filterable is a plain object:
 * ```coffeescript [specscript]
 * predicate(item any, key string, filterable Object) -> booleanResult Promise|boolean|any
 * ```
 *
 * If the filterable is an object with a `.filter` method, the predicate function signature is defined externally.
 *
 * If the filterable is a generator, the predicate function must be synchronous.
 *
 * If the predicate function is asynchronous, it is executed concurrently.
 *
 * ```javascript [playground]
 * const asyncIsOdd = async number => number % 2 == 1
 *
 * const array = [1, 2, 3, 4, 5]
 *
 * const result = await filter(array, asyncIsOdd)
 *
 * console.log(result)
 * ```
 *
 * `filter` applies the predicate function to just the values of objects and maps.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const object = { a: 1, b: 2, c: 3, d: 4, e: 5 }
 * const map = new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]])
 *
 * const filteredObject = filter(object, isOdd)
 * const filteredMap = filter(map, isOdd)
 *
 * console.log(filteredObject)
 * console.log(filteredMap)
 * ```
 *
 * For generators, `filter` returns a filtered generator.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const generateNumbers = function* () {
 *   yield 1; yield 2; yield 3; yield 4; yield 5
 * }
 *
 * const numbers = generateNumbers()
 * const oddNumbers = filter(generateNumbers(), isOdd)
 *
 * console.log('numbers')
 * for (const number of numbers) {
 *   console.log(number)
 * }
 *
 * console.log('odd numbers')
 * for (const number of oddNumbers) {
 *   console.log(number)
 * }
 * ```
 *
 * If the filterable is a promise, it is resolved for its value before further execution for the eager interface only. 
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * filter(Promise.resolve([1, 2, 3, 4, 5]), isOdd).then(console.log)
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
