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
 * type UnarySyncOrAsyncPredicate = any=>Promise|boolean
 *
 * predicate UnarySyncOrAsyncPredicate
 *
 * every(foldable Foldable, predicate) -> result Promise|boolean
 * every(predicate)(foldable Foldable) -> result Promise|boolean
 * ```
 *
 * @description
 * Test a predicate concurrently across all elements of a foldable, returning true if all executions return true.
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
 * The following data types are considered to be foldables:
 *  * `array`
 *  * `set`
 *  * `map`
 *  * `generator`
 *  * `async generator`
 *  * `object with .reduce method`
 *  * `object`
 *
 * `every` works for async generators.
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
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * every(Promise.resolve([1, 2, 3, 4, 5]), n => n < 6).then(console.log) // true
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
