const isPromise = require('./_internal/isPromise')
const __ = require('./_internal/placeholder')
const curry2 = require('./_internal/curry2')
const isArray = require('./_internal/isArray')
const arrayEvery = require('./_internal/arrayEvery')
const iteratorEvery = require('./_internal/iteratorEvery')
const asyncIteratorEvery = require('./_internal/asyncIteratorEvery')
const objectValues = require('./_internal/objectValues')
const reducerEvery = require('./_internal/reducerEvery')
const symbolIterator = require('./_internal/symbolIterator')
const symbolAsyncIterator = require('./_internal/symbolAsyncIterator')

// _every(collection Array|Iterable|AsyncIterable|{ reduce: function }|Object, predicate function) -> Promise|boolean
const _every = function (collection, predicate) {
  if (isArray(collection)) {
    return arrayEvery(collection, predicate)
  }
  if (collection == null) {
    return predicate(collection)
  }

  if (typeof collection[symbolIterator] == 'function') {
    return iteratorEvery(collection[symbolIterator](), predicate)
  }
  if (typeof collection[symbolAsyncIterator] == 'function') {
    return asyncIteratorEvery(
      collection[symbolAsyncIterator](), predicate, new Set()
    )
  }
  if (typeof collection.reduce == 'function') {
    return collection.reduce(reducerEvery(predicate), true)
  }
  if (collection.constructor == Object) {
    return arrayEvery(objectValues(collection), predicate)
  }
  return predicate(collection)
}

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
 * `every` supports a lazy API for composability.
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
const every = function (...args) {
  const predicate = args.pop()
  if (args.length == 0) {
    return curry2(_every, __, predicate)
  }

  const collection = args[0]
  if (isPromise(collection)) {
    return collection.then(curry2(_every, __, predicate))
  }

  return _every(collection, predicate)
}

module.exports = every
