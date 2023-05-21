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
const forEach = function (...args) {
  const callback = args.pop()
  if (args.length == 0) {
    return curry2(_forEach, __, callback)
  }
  const collection = args[0]
  return isPromise(collection)
    ? collection.then(curry2(_forEach, __, callback))
    : _forEach(collection, callback)
}

module.exports = forEach
