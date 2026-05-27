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
 * type Foldable = Array|Set|Map|Generator|AsyncGenerator|{ reduce: function }|Object
 * type Predicate = any=>Promise|boolean
 *
 * every(foldable Foldable, predicate Predicate) -> result Promise|boolean
 * every(predicate Predicate)(foldable Foldable) -> result Promise|boolean
 * ```
 *
 * @description
 * Tests a predicate concurrently across all items of a foldable. Returns true if every item tests true by the predicate.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * {
 *   const array = [1, 2, 3, 4, 5]
 *   const isEveryNumberOdd = every(array, isOdd)
 *   console.log(isEveryNumberOdd)
 * }
 *
 * {
 *   const array = [1, 3, 5]
 *   const isEveryNumberOdd = every(array, isOdd)
 *   console.log(isEveryNumberOdd)
 * }
 * ```
 *
 * The following data types are considered to be foldables:
 *  * `array`
 *  * `set`
 *  * `map`
 *  * `generator`
 *  * `async generator`
 *  * `object with .reduce method`
 *  * `object`
 *
 * `every` supports a lazy interface for composability.
 *
 * ```javascript [playground]
 * pipe([1, 2, 3], [
 *   every(number => number < 5),
 *   console.log,
 * ])
 * ```
 *
 * If the foldable is a promise, it is resolved for its value before further execution for the eager interface only.
 *
 * ```javascript [playground]
 * every(Promise.resolve([1, 2, 3, 4, 5]), n => n < 6).then(console.log)
 * ```
 *
 * See also:
 *  * [map](/docs/map)
 *  * [some](/docs/some)
 *  * [and](/docs/and)
 *
 * @execution concurrent
 *
 * @muxing
 */
const every = function (arg0, arg1) {
  if (typeof arg0 == 'function') {
    return curry2(_every, __, arg0)
  }
  return isPromise(arg0)
    ? arg0.then(curry2(_every, __, arg1))
    : _every(arg0, arg1)
}

module.exports = every
