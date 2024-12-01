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
    return collection.forEach(callback)
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
 * type Collection = Array|Iterable|AsyncIterable|{ forEach: function }|Object
 *
 * forEach(collection Collection, callback function) -> collection Promise|Collection
 *
 * forEach(callback function)(collection Collection) -> collection Promise|Collection
 * ```
 *
 * @description
 * Execute a callback for each item of a collection, returning a Promise if the execution is asynchronous. Asynchronous execution happens concurrently.
 *
 * ```javascript [playground]
 * forEach([1, 2, 3, 4, 5], console.log) // 1 2 3 4 5
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
 * type Collection = Array|Iterable|AsyncIterable|{ forEach: function }|Object
 *
 * forEach.series(collection Collection, callback function) -> collection Promise|Collection
 *
 * forEach.series(callback function)(collection Collection) -> collection Promise|Collection
 * ```
 *
 * @description
 * Execute a callback for each item of a collection, returning a Promise if the execution is asynchronous. Asynchronous execution happens in series.
 *
 * ```javascript [playground]
 * forEach.series([1, 2, 3, 4, 5], console.log) // 1 2 3 4 5
 *
 * forEach.series({ a: 1, b: 2, c: 3 }, console.log) // 1 2 3
 * ```
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
