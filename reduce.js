const isPromise = require('./_internal/isPromise')
const __ = require('./_internal/placeholder')
const curry3 = require('./_internal/curry3')
const genericReduce = require('./_internal/genericReduce')

// _reduce(collection any, reducer function, initial function|any) -> Promise
const _reduce = function (collection, reducer, initial) {
  if (typeof initial == 'function') {
    const actualInitialValue = initial(collection)
    return isPromise(actualInitialValue)
      ? actualInitialValue.then(curry3(genericReduce, collection, reducer, __))
      : genericReduce(collection, reducer, actualInitialValue)
  }
  return isPromise(initial)
    ? initial.then(curry3(genericReduce, collection, reducer, __))
    : genericReduce(collection, reducer, initial)
}

/**
 * @name reduce
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Foldable = Array|Set|Map|Generator|AsyncGenerator|{ reduce: function }|Object
 *
 * type SyncOrAsyncReducer = (
 *   accumulator any,
 *   item any,
 *   indexOrKey number|string|any,
 *   foldable Foldable
 * )=>(nextAccumulator Promise|any)
 *
 * type UnarySyncOrAsyncResolver = any=>Promise|any
 *
 * reduce(foldable Promise|Foldable, reducer SyncOrAsyncReducer) -> accumulator Promise|any
 * reduce(foldable Promise|Foldable, reducer SyncOrAsyncReducer, initialValue Promise|any) -> accumulator Promise|any
 * reduce(foldable Promise|Foldable, reducer SyncOrAsyncReducer, initialResolver UnarySyncOrAsyncResolver) -> accumulator Promise|any
 *
 * reduce(reducer SyncOrAsyncReducer)(foldable Foldable) -> accumulator Promise|any
 * reduce(reducer SyncOrAsyncReducer, initialValue Promise|any)(foldable Foldable) -> accumulator Promise|any
 * reduce(reducer SyncOrAsyncReducer, initialResolver UnarySyncOrAsyncResolver)(foldable Foldable) -> accumulator Promise|any
 * ```
 *
 * @description
 * Reduces a foldable to an accumulated value.
 *
 * ```javascript [playground]
 * const max = (a, b) => a > b ? a : b
 *
 * const result = reduce([1, 3, 5, 4, 2], max)
 *
 * console.log(result)
 * ```
 *
 * `reduce` executes a reducer function for each item of a foldable in order. If an initial value is provided, `reduce` starts iterating from the first item of the foldable. If no initial value is provided, `reduce` uses the first item of the foldable as the initial value and starts iterating from the second item of the foldable.
 *
 * ```javascript [playground]
 * const add = (a, b) => a + b
 *
 * const result = reduce([1, 2, 3, 4, 5], add, 10)
 *
 * console.log(result)
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
 * The reducing operation is expressed by the reducer function and optional initial value, which defines a transformation between an accumulator and a given item of the foldable.
 *
 * ```javascript
 * const reducer = function (accumulator, item) {
 *   // nextAccumulator is the result of some operation between accumulator and item
 *   // and becomes the accumulator for the next iteration and invocation of the reducer
 *   return nextAccumulator
 * }
 * ```
 *
 * The reducer function signature changes depending on the provided foldable.
 *
 * If the foldable is an array:
 * ```coffeescript [specscript]
 * reducer(
 *   accumulator any,
 *   item any,
 *   index number,
 *   fold Array
 * ) -> nextAccumulator Promise|any
 * ```
 *
 * If the foldable is a set:
 * ```coffeescript [specscript]
 * reducer(
 *   accumulator any,
 *   item any
 * ) -> nextAccumulator Promise|any
 * ```
 *
 * If the foldable is a map:
 * ```coffeescript [specscript]
 * reducer(
 *   accumulator any,
 *   item any,
 *   key any,
 *   fold Map
 * ) -> nextAccumulator Promise|any
 * ```
 *
 * If the foldable is a generator:
 * ```coffeescript [specscript]
 * reducer(
 *   accumulator any,
 *   item any
 * ) -> nextAccumulator Promise|any
 * ```
 *
 * If the foldable is a async generator:
 * ```coffeescript [specscript]
 * reducer(
 *   accumulator any,
 *   item any
 * ) -> nextAccumulator Promise|any
 * ```
 *
 * If the foldable is a plain object:
 * ```coffeescript [specscript]
 * reducer(
 *   accumulator any,
 *   item any,
 *   key string,
 *   fold Object
 * ) -> nextAccumulator Promise|any
 * ```
 *
 * If the foldable is an object with a `.reduce` method, the reducer function signature is defined externally.
 *
 * If the reducer is asynchronous, all promises created by the reducer are resolved before continuing with the reducing operation.
 *
 * ```javascript [playground]
 * const asyncAdd = async (a, b) => a + b
 *
 * const result = await reduce([1, 2, 3, 4, 5], asyncAdd, 0)
 *
 * console.log(result)
 * ```
 *
 * If the initialization parameter is a function, it is treated as a resolver of the initial value and called with the foldable.
 *
 * ```javascript [playground]
 * const concatSquares = (array, value) => array.concat(value ** 2)
 *
 * const array = [1, 2, 3, 4, 5]
 *
 * const result = reduce(array, concatSquares, () => [])
 *
 * console.log(result)
 * ```
 *
 * `reduce` iterates over just the values of objects and maps.
 *
 * ```javascript [playground]
 * const add = (a, b) => a + b
 *
 * const object = { a: 1, b: 2, c: 3, d: 4, e: 5 }
 * const map = new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]])
 *
 * const objectResult = reduce(object, add)
 * const mapResult = reduce(map, add)
 *
 * console.log(objectResult)
 * console.log(mapResult)
 * ```
 *
 * `reduce` reduces async generators.
 *
 * ```javascript [playground]
 * const add = (a, b) => a + b
 *
 * const generateAsyncNumbers = async function* () {
 *   yield 1; yield 2; yield 3; yield 4; yield 5
 * }
 *
 * const result = await reduce(generateAsyncNumbers(), add)
 *
 * console.log(result)
 * ```
 *
 * If the foldable or initial value is a promise, it is resolved for its value before further execution for the eager interface only.
 *
 * ```javascript [playground]
 * const add = (a, b) => a + b
 *
 * const resultWithPromiseFoldable = await reduce(Promise.resolve([1, 2, 3, 4, 5]), add, 0)
 *
 * const resultWithPromiseInitialValue = await reduce([1, 2, 3, 4, 5], add, Promise.resolve(0))
 *
 * console.log(resultWithPromiseFoldable)
 * console.log(resultWithPromiseInitialValue)
 * ```
 *
 * See also:
 *  * [forEach](/docs/forEach)
 *  * [map](/docs/map)
 *  * [filter](/docs/filter)
 *  * [transform](/docs/transform)
 *  * [flatMap](/docs/flatMap)
 *  * [some](/docs/some)
 *
 * @execution series
 *
 * @transducing
 *
 * @TODO readerReduce
 *
 * @TODO reduce.concurrent
 */

const reduce = function (...args) {
  if (typeof args[0] == 'function') {
    return curry3(_reduce, __, args[0], args[1])
  }
  if (isPromise(args[0])) {
    return args[0].then(curry3(_reduce, __, args[1], args[2]))
  }
  return _reduce(args[0], args[1], args[2])
}

module.exports = reduce
