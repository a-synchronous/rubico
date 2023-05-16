const isArray = require('./_internal/isArray')
const arrayAll = require('./_internal/arrayAll')
const iteratorAll = require('./_internal/iteratorAll')
const asyncIteratorAll = require('./_internal/asyncIteratorAll')
const objectValues = require('./_internal/objectValues')
const reducerAll = require('./_internal/reducerAll')
const symbolIterator = require('./_internal/symbolIterator')
const symbolAsyncIterator = require('./_internal/symbolAsyncIterator')

/**
 * @name every
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Foldable = Iterable|AsyncIterable|Object
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
 *   every(isOdd)([1, 2, 3, 4, 5]),
 * ) // false
 *
 * console.log(
 *   every(isOdd)([1, 3, 5]),
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
 * every(async number => number < 6)(asyncNumbers()).then(console.log) // true
 * ```
 *
 * @execution concurrent
 *
 * @muxing
 */
const every = predicate => function allTruthy(value) {
  if (isArray(value)) {
    return arrayAll(value, predicate)
  }
  if (value == null) {
    return predicate(value)
  }

  if (typeof value[symbolIterator] == 'function') {
    return iteratorAll(value[symbolIterator](), predicate)
  }
  if (typeof value[symbolAsyncIterator] == 'function') {
    return asyncIteratorAll(value[symbolAsyncIterator](), predicate, new Set())
  }
  if (typeof value.reduce == 'function') {
    return value.reduce(reducerAll(predicate), true)
  }
  if (value.constructor == Object) {
    return arrayAll(objectValues(value), predicate)
  }
  return predicate(value)
}

module.exports = every
