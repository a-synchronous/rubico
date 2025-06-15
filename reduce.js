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
 *   element any,
 *   indexOrKey number|string|any,
 *   foldable Foldable
 * )=>(nextAccumulator Promise|any)
 *
 * type UnarySyncOrAsyncResolver = any=>Promise|any
 *
 * reducer SyncOrAsyncReducer
 * initial UnarySyncOrAsyncResolver|any
 *
 * reduce(foldable Promise|Foldable, reducer, initial?) -> result Promise|any
 * reduce(reducer, initial?)(foldable Foldable) -> result Promise|any
 * ```
 *
 * @description
 * Reduces a foldable to a single value.
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
 * The reducing operation is dictated by a provided reducer function, which defines a transformation between the accumulator and a given element of the foldable.
 *
 * ```javascript
 * const reducer = function (accumulator, element) {
 *   // nextAccumulator is the result of some operation between accumulator and element
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
 *   element any,
 *   index number,
 *   fold Array
 * ) -> nextAccumulator Promise|any
 * ```
 *
 * If the foldable is a set:
 * ```coffeescript [specscript]
 * reducer(
 *   accumulator any,
 *   element any
 * ) -> nextAccumulator Promise|any
 * ```
 *
 * If the foldable is a map:
 * ```coffeescript [specscript]
 * reducer(
 *   accumulator any,
 *   element any,
 *   key any,
 *   fold Map
 * ) -> nextAccumulator Promise|any
 * ```
 *
 * If the foldable is a generator:
 * ```coffeescript [specscript]
 * reducer(
 *   accumulator any,
 *   element any
 * ) -> nextAccumulator Promise|any
 * ```
 *
 * If the foldable is a async generator:
 * ```coffeescript [specscript]
 * reducer(
 *   accumulator any,
 *   element any
 * ) -> nextAccumulator Promise|any
 * ```
 *
 * If the foldable is an object with a `.reduce` method, the reducer function signature is defined externally.
 *
 * If the foldable is a plain object:
 * ```coffeescript [specscript]
 * reducer(
 *   accumulator any,
 *   element any,
 *   key string,
 *   fold Object
 * ) -> nextAccumulator Promise|any
 * ```
 *
 * `reduce` executes a reducer function for each element of the array in order. If no initial value is provided, `reduce` uses the first element of the foldable as the initial value and starts iterating from the second element of the foldable.
 *
 * ```javascript [playground]
 * const max = (a, b) => a > b ? a : b
 *
 * const result = reduce([1, 3, 5, 4, 2], max)
 * console.log(result) // 5
 * ```
 *
 * If an initial value is provided, the accumulator starts as the initial value rather than the first element of the foldable.
 *
 * ```javascript [playground]
 * const add = (a, b) => a + b
 *
 * const result = reduce([1, 2, 3, 4, 5], add, 0)
 * console.log(result) // 15
 * ```
 *
 * If the reducer is asynchronous, all promises created by the reducer are resolved before continuing with the reducing operation.
 *
 * ```javascript [playground]
 * const asyncAdd = async (a, b) => a + b
 *
 * const promise = reduce([1, 2, 3, 4, 5], asyncAdd, 0)
 * promise.then(console.log) // 15
 * ```
 *
 * If the initialization parameter is a function, it is treated as a resolver of the initial value and called with the foldable.
 *
 * ```javascript [playground]
 * const concatSquares = (array, value) => array.concat(value ** 2)
 *
 * const contrivedInitializer = array => [`initial length ${array.length}`]
 *
 * const array = [1, 2, 3, 4, 5]
 *
 * console.log(reduce(array, concatSquares, contrivedInitializer))
 * // ['initial length 5', 1, 4, 9, 16, 25]
 * ```
 *
 * For objects, `reduce` iterates over just the values.
 *
 * ```javascript [playground]
 * const add = (a, b) => a + b
 *
 * const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 }
 *
 * const result = reduce(obj, add)
 * console.log(result) // 15
 * ```
 *
 * For maps, `reduce` iterates over the values of the entries.
 *
 * ```javascript [playground]
 * const add = (a, b) => a + b
 *
 * const m = new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]])
 *
 * const result = reduce(m, add)
 * console.log(result) // 15
 * ```
 *
 * `reduce` works for async generators.
 *
 * ```javascript [playground]
 * const asyncAdd = async (a, b) => a + b
 *
 * const asyncGenerate = async function* () {
 *   yield 1; yield 2; yield 3; yield 4; yield 5
 * }
 *
 * reduce(asyncGenerate(), asyncAdd).then(console.log) // 15
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * const add = (a, b) => a + b
 *
 * reduce(Promise.resolve([1, 2, 3, 4, 5]), add, 0).then(console.log) // 15
 * ```
 *
 * Any promises passed for the initial value are also resolved before further execution.
 *
 * ```javascript [playground]
 * const add = (a, b) => a + b
 *
 * const promise = reduce([1, 2, 3, 4, 5], add, Promise.resolve(0))
 * promise.then(console.log) // 15
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
