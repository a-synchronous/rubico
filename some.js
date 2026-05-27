const isPromise = require('./_internal/isPromise')
const __ = require('./_internal/placeholder')
const curry2 = require('./_internal/curry2')
const isArray = require('./_internal/isArray')
const objectValues = require('./_internal/objectValues')
const arraySome = require('./_internal/arraySome')
const iteratorSome = require('./_internal/iteratorSome')
const asyncIteratorSome = require('./_internal/asyncIteratorSome')
const reducerSome = require('./_internal/reducerSome')
const symbolIterator = require('./_internal/symbolIterator')
const symbolAsyncIterator = require('./_internal/symbolAsyncIterator')

// _some(collection Array|Iterable|AsyncIterable|{ reduce: function }|Object, predicate function) -> Promise|boolean
const _some = function (collection, predicate) {
  if (isArray(collection)) {
    return arraySome(collection, predicate)
  }
  if (collection == null) {
    return predicate(collection)
  }
  if (typeof collection[symbolIterator] == 'function') {
    return iteratorSome(collection[symbolIterator](), predicate)
  }
  if (typeof collection[symbolAsyncIterator] == 'function') {
    return asyncIteratorSome(
      collection[symbolAsyncIterator](), predicate, new Set()
    )
  }
  if (typeof collection.reduce == 'function') {
    return collection.reduce(reducerSome(predicate), false)
  }
  if (collection.constructor == Object) {
    return arraySome(objectValues(collection), predicate)
  }
  return predicate(collection)
}

/**
 * @name some
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Foldable = Array|Set|Map|Generator|AsyncGenerator|{ reduce: function }|Object
 * type Predicate = any=>Promise|boolean
 *
 * some(foldable Promise|Foldable, predicate Predicate) -> booleanResult Promise|boolean
 * some(predicate Predicate)(foldable Foldable) -> booleanResult Promise|boolean
 * ```
 *
 * @description
 * Tests a predicate concurrently across all items of a foldable. Returns true if any item tests true by the predicate.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const array = [1, 2, 3, 4, 5]
 *
 * const arrayHasOddNumbers = some(array, isOdd)
 *
 * console.log(arrayHasOddNumbers)
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
 * `some` supports a lazy interface for composability.
 *
 * ```javascript [playground]
 * pipe([1, 2, 3], [
 *   some(number => number < 5),
 *   console.log,
 * ])
 * ```
 *
 * If the foldable is a promise, it is resolved for its value before further execution for the eager interface only.
 *
 * ```javascript [playground]
 * some(Promise.resolve([1, 2, 3, 4, 5]), n => n > 6).then(console.log)
 * ```
 *
 * See also:
 *  * [map](/docs/map)
 *  * [every](/docs/every)
 *  * [and](/docs/and)
 *
 * @execution concurrent
 *
 * @muxing
 *
 * @related or
 */
const some = function (arg0, arg1) {
  if (typeof arg0 == 'function') {
    return curry2(_some, __, arg0)
  }
  return isPromise(arg0)
    ? arg0.then(curry2(_some, __, arg1))
    : _some(arg0, arg1)
}

module.exports = some
