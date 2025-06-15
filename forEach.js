const isPromise = require('./_internal/isPromise')
const __ = require('./_internal/placeholder')
const curry2 = require('./_internal/curry2')
const isArray = require('./_internal/isArray')
const isGeneratorFunction = require('./_internal/isGeneratorFunction')
const isAsyncGeneratorFunction = require('./_internal/isAsyncGeneratorFunction')
const arrayForEach = require('./_internal/arrayForEach')
const objectForEach = require('./_internal/objectForEach')
const iteratorForEach = require('./_internal/iteratorForEach')
const asyncIteratorForEach = require('./_internal/asyncIteratorForEach')
const symbolIterator = require('./_internal/symbolIterator')
const symbolAsyncIterator = require('./_internal/symbolAsyncIterator')
const arrayForEachSeries = require('./_internal/arrayForEachSeries')
const objectForEachSeries = require('./_internal/objectForEachSeries')
const iteratorForEachSeries = require('./_internal/iteratorForEachSeries')
const asyncIteratorForEachSeries = require('./_internal/asyncIteratorForEachSeries')

// type Collection = Array|Iterable|AsyncIterable|{ forEach: function }|Object
// _forEach(collection Collection, callback function) -> collection Collection
const _forEach = function (collection, callback) {
  if (isArray(collection)) {
    return arrayForEach(collection, callback)
  }
  if (collection == null) {
    return collection
  }
  if (typeof collection.forEach == 'function') {
    collection.forEach(callback)
    return collection
  }
  if (typeof collection[symbolIterator] == 'function') {
    return iteratorForEach(collection[symbolIterator](), callback)
  }
  if (typeof collection[symbolAsyncIterator] == 'function') {
    return asyncIteratorForEach(collection[symbolAsyncIterator](), callback)
  }
  if (collection.constructor == Object) {
    return objectForEach(collection, callback)
  }
  return collection
}

/**
 * @name forEach
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Iterable = Array|Set|Map|Generator|AsyncGenerator|{ forEach: function }|Object
 *
 * type SyncOrAsyncCallback = (
 *   element any,
 *   indexOrKey number|string|any,
 *   iter Iterable
 * )=>Promise|undefined
 *
 * iterable Iterable
 * cb SyncOrAsyncCallback
 *
 * forEach(iterable, cb) -> unmodifiedIterable Promise|Iterable
 * forEach(cb)(iterable) -> unmodifiedIterable Promise|Iterable
 * ```
 *
 * @description
 * Execute a callback function for each element of an iterable, returning the original iterable unmodified.
 *
 * The following data types are considered to be iterables:
 *  * `array`
 *  * `set`
 *  * `map`
 *  * `generator`
 *  * `async generator`
 *  * `object with .forEach method`
 *  * `object`
 *
 * The callback function signature changes depending on the provided iterable.
 *
 * If the iterable is an array:
 * ```coffeescript [specscript]
 * callback(element any, index number, iter Array) -> Promise|undefined
 * ```
 *
 * If the iterable is a set:
 * ```coffeescript [specscript]
 * callback(element any, key any, iter Set) -> Promise|undefined
 * ```
 *
 * If the iterable is a map:
 * ```coffeescript [specscript]
 * callback(element any, key any, filt Map) -> Promise|undefined
 * ```
 *
 * If the iterable is a generator:
 * ```coffeescript [specscript]
 * callback(element any) -> Promise|undefined
 * ```
 *
 * If the iterable is an async generator:
 * ```coffeescript [specscript]
 * callback(element any) -> Promise|undefined
 * ```
 *
 * If the iterable is an object with a `.forEach` method, the callback function signature is defined externally.
 *
 * If the iterable is a plain object:
 * ```coffeescript [specscript]
 * callback(element any, key string, iter Object) -> Promise|undefined
 * ```
 *
 * If the callback function is asynchronous, it is executed concurrently.
 *
 * ```javascript [playground]
 * forEach([1, 2, 3, 4, 5], async number => {
 *   await new Promise(resolve => {
 *     setTimeout(resolve, 1000)
 *   })
 *   console.log(number)
 * })
 * ```
 *
 * `forEach` works for arrays.
 *
 * ```javascript [playground]
 * forEach([1, 2, 3, 4, 5], num => console.log(num)) // 1 2 3 4 5
 * ```
 *
 * `forEach` works for objects.
 *
 * ```javascript [playground]
 * forEach({ a: 1, b: 2, c: 3 }, num => console.log(num)) // 1 2 3
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
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * forEach(Promise.resolve([1, 2, 3]), console.log)
 * // 1
 * // 2
 * // 3
 * ```
 *
 * See also:
 *  * [pipe](/docs/pipe)
 *  * [tap](/docs/tap)
 *  * [all](/docs/all)
 *  * [forEach.series](/docs/forEach.series)
 *  * [map](/docs/map)
 */
const forEach = function (arg0, arg1) {
  if (typeof arg0 == 'function') {
    return curry2(_forEach, __, arg0)
  }
  return isPromise(arg0)
    ? arg0.then(curry2(_forEach, __, arg1))
    : _forEach(arg0, arg1)
}

/**
 * @name _forEachSeries
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Collection = Array|Iterable|AsyncIterable|{ forEach: function }|Object
 *
 * _forEachSeries(collection Collection, callback function) -> collection Promise|Collection
 * ```
 */
const _forEachSeries = function (collection, callback) {
  if (isArray(collection)) {
    return arrayForEachSeries(collection, callback)
  }
  if (collection == null) {
    throw new TypeError(`invalid collection ${collection}`)
  }
  if (typeof collection[symbolIterator] == 'function') {
    return iteratorForEachSeries(collection[symbolIterator](), callback)
  }
  if (typeof collection[symbolAsyncIterator] == 'function') {
    return asyncIteratorForEachSeries(collection[symbolAsyncIterator](), callback)
  }
  if (collection.constructor == Object) {
    return objectForEachSeries(collection, callback)
  }
  throw new TypeError(`invalid collection ${collection}`)
}

/**
 * @name forEach.series
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Iterable = Array|Set|Map|Generator|AsyncGenerator|{ forEach: function }|Object
 *
 * type SyncOrAsyncCallback = (
 *   element any,
 *   indexOrKey number|string|any,
 *   iter Iterable
 * )=>Promise|undefined
 *
 * iterable Iterable
 * cb SyncOrAsyncCallback
 *
 * forEach(iterable, cb) -> unmodifiedIterable Promise|Iterable
 * forEach(cb)(iterable) -> unmodifiedIterable Promise|Iterable
 * ```
 *
 * @description
 * [forEach](/docs/forEach) with serial execution.
 *
 * ```javascript [playground]
 * forEach.series([1, 2, 3, 4, 5], async number => {
 *   await new Promise(resolve => {
 *     setTimeout(resolve, 1000)
 *   })
 *   console.log(number)
 *   // 1
 *   // 2
 *   // 3
 *   // 4
 *   // 5
 * })
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * forEach.series(Promise.resolve([1, 2, 3]), console.log)
 * // 1
 * // 2
 * // 3
 * ```
 *
 * See also:
 *  * [pipe](/docs/pipe)
 *  * [tap](/docs/tap)
 *  * [all](/docs/all)
 *  * [forEach](/docs/forEach)
 *  * [map](/docs/map)
 */
forEach.series = function forEachSeries(arg0, arg1) {
  if (typeof arg0 == 'function') {
    return curry2(_forEachSeries, __, arg0)
  }
  return isPromise(arg0)
    ? arg0.then(curry2(_forEachSeries, __, arg1))
    : _forEachSeries(arg0, arg1)
}

module.exports = forEach
