const MappingIterator = require('./_internal/MappingIterator')
const MappingAsyncIterator = require('./_internal/MappingAsyncIterator')
const isArray = require('./_internal/isArray')
const isGeneratorFunction = require('./_internal/isGeneratorFunction')
const isAsyncGeneratorFunction = require('./_internal/isAsyncGeneratorFunction')
const arrayMap = require('./_internal/arrayMap')
const generatorFunctionMap = require('./_internal/generatorFunctionMap')
const asyncGeneratorFunctionMap = require('./_internal/asyncGeneratorFunctionMap')
const reducerMap = require('./_internal/reducerMap')
const stringMap = require('./_internal/stringMap')
const setMap = require('./_internal/setMap')
const mapMap = require('./_internal/mapMap')
const objectMap = require('./_internal/objectMap')
const arrayMapSeries = require('./_internal/arrayMapSeries')
const arrayMapPool = require('./_internal/arrayMapPool')
const arrayMapWithIndex = require('./_internal/arrayMapWithIndex')
const symbolIterator = require('./_internal/symbolIterator')

/**
 * @name map
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Functor<T> = Array<T>|Object<T>|Iterator<T>|AsyncIterator<T>|{ map: T=>any }
 * Reducer<T> = (any, T)=>Promise|any
 *
 * var T any,
 *   mapper T=>Promise|any,
 *   functor Functor<T>
 *   args ...any,
 *   generatorFunction ...args=>Generator<T>,
 *   asyncGeneratorFunction ...args=>AsyncGenerator<T>,
 *   reducer Reducer<T>
 *
 * map(mapper)(functor) -> Promise|Functor
 *
 * map(mapper)(generatorFunction) -> ...args=>Generator
 *
 * map(mapper)(asyncGeneratorFunction) -> ...args=>AsyncGenerator
 *
 * map(mapper)(reducer) -> Reducer
 * ```
 *
 * @description
 * Apply a mapper concurrently to each item of a collection, returning the results in a collection of the same type. If order is implied by the collection, it is maintained in the result. Below are valid collections along with their iteration behavior.
 *
 *  * `Array` - iterate values by index
 *  * `Object` - iterate object values
 *  * `Map` - iterate Map values (not entries)
 *  * `Iterator`/`Generator` - iterate by calling `.next`
 *  * `AsyncIterator`/`AsyncGenerator` - iterate by calling `.next`
 *  * `{ map: function }` - call `.map` directly
 *
 * ```javascript [playground]
 * const square = number => number ** 2
 *
 * console.log(
 *   map(square)([1, 2, 3, 4, 5]),
 * ) // [1, 4, 9, 16, 25]
 *
 * console.log(
 *   map(square)(new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]])),
 * ) // Map { 'a' => 1, 'b' => 4, 'c' => 9, 'd' => 16, 'e' => 25 }
 *
 * console.log(
 *   map(square)({ a: 1, b: 2, c: 3, d: 4, e: 5 }),
 * ) // { a: 1, b: 4, c: 9, d: 16, e: 25 }
 * ```
 *
 * Functions are regarded as resolvers. Each of the following calls, when passed to a mapping function `map(mapper)`, creates a function with all items of its return transformed by the mapper.
 *
 *  * `GeneratorFunction` - items of the iterator are mapped into a new iterator. Warning: using an async mapper in a synchronous generator function is not recommended and could lead to unexpected behavior.
 *  * `AsyncGeneratorFunction` - items of the async iterator are mapped into a new async iterator. Async result items are awaited in a new async iterator. Async mapper functions are valid.
 *  * `Reducer` - items of a reducing operation are transformed by the mapper function. Fully asynchronous transducing operations are possible with a mapping reducer and `reduce`.
 *
 * ```javascript [playground]
 * const capitalize = string => string.toUpperCase()
 *
 * const abc = function* () {
 *   yield 'a'; yield 'b'; yield 'c'
 * }
 *
 * const ABC = map(capitalize)(abc)
 *
 * const abcIter = abc()
 *
 * const ABCIter = ABC()
 *
 * console.log([...abcIter]) // ['a', 'b', 'c']
 *
 * console.log([...ABCIter]) // ['A', 'B', 'C']
 * ```
 *
 * Function laziness is extended to reducer functions as [transducers](https://github.com/a-synchronous/rubico/blob/master/TRANSDUCERS.md).
 *
 * ```coffeescript [specscript]
 * Reducer<T> = (any, T)=>Promise|any
 *
 * Transducer = Reducer=>Reducer
 * ```
 *
 * A reducer is a variadic function like the one supplied to `Array.prototype.reduce`, but without the index and reference to the accumulated result per call. A transducer is a function that accepts a reducer function as an argument and returns another reducer function, which enables chaining functionality for reducers. `map` is core to this mechanism, and provides a way to create transducers with mapper functions.
 *
 * ```javascript [playground]
 * const square = number => number ** 2
 *
 * const concat = (array, item) => array.concat(item)
 *
 * const mapSquare = map(square)
 * // mapSquare could potentially be a transducer, but at this point, it is
 * // undifferentiated and not necessarily locked in to transducer behavior.
 *
 * console.log(
 *   mapSquare([1, 2, 3, 4, 5]),
 * ) // [1, 4, 9, 16, 25]
 *
 * const squareConcatReducer = mapSquare(concat)
 * // now mapSquare is passed the function concat, so it assumes transducer
 * // position. squareConcatReducer is a reducer with chained functionality
 * // square and concat.
 *
 * console.log(
 *   [1, 2, 3, 4, 5].reduce(squareConcatReducer, []),
 * ) // [1, 4, 9, 16, 25]
 *
 * console.log(
 *   [1, 2, 3, 4, 5].reduce(squareConcatReducer, ''),
 * ) // '1491625'
 * ```
 *
 * @execution concurrent
 *
 * @transducing
 *
 * @TODO streamMap
 */

const map = mapper => function mapping(value) {
  if (isArray(value)) {
    return arrayMap(value, mapper)
  }
  if (typeof value == 'function') {
    if (isGeneratorFunction(value)) {
      return generatorFunctionMap(value, mapper)
    }
    if (isAsyncGeneratorFunction(value)) {
      return asyncGeneratorFunctionMap(value, mapper)
    }
    return reducerMap(value, mapper)
  }
  if (value == null) {
    return value
  }

  if (typeof value.next == 'function') {
    return symbolIterator in value
      ? MappingIterator(value, mapper)
      : MappingAsyncIterator(value, mapper)
  }
  if (typeof value == 'string' || value.constructor == String) {
    return stringMap(value, mapper)
  }
  if (value.constructor == Set) {
    return setMap(value, mapper)
  }
  if (value.constructor == Map) {
    return mapMap(value, mapper)
  }
  if (value.constructor == Object) {
    return objectMap(value, mapper)
  }
  return typeof value.map == 'function' ? value.map(mapper) : mapper(value)
}

/**
 * @name map.series
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var T any,
 *   mapper T=>Promise|any,
 *   array Array<T>
 *
 * map.series(mapper)(array) -> Promise|Array
 * ```
 *
 * @description
 * `map` with serial execution.
 *
 * ```javascript [playground]
 * const delayedLog = number => new Promise(function (resolve) {
 *   setTimeout(function () {
 *     console.log(number)
 *     resolve()
 *   }, 1000)
 * })
 *
 * console.log('start')
 * map.series(delayedLog)([1, 2, 3, 4, 5])
 * ```
 *
 * @execution series
 */
map.series = mapper => function mappingInSeries(value) {
  if (isArray(value)) {
    return arrayMapSeries(value, mapper)
  }
  throw new TypeError(`${value} is not an Array`)
}

/**
 * @name map.pool
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var maxConcurrency number,
 *   T any,
 *   mapper T=>Promise|any,
 *   array Array<T>
 *
 * map.pool(maxConcurrency, mapper)(array) -> Promise|Array
 * ```
 *
 * @description
 * `map` with limited concurrency.
 *
 * ```javascript [playground]
 * const delayedLog = x => new Promise(function (resolve) {
 *   setTimeout(function () {
 *     console.log(x)
 *     resolve()
 *   }, 1000)
 * })
 *
 * console.log('start')
 * map.pool(2, delayedLog)([1, 2, 3, 4, 5])
 * ```
 *
 * @execution concurrent
 */
map.pool = (concurrencyLimit, mapper) => function concurrentPoolMapping(value) {
  if (isArray(value)) {
    return arrayMapPool(value, mapper, concurrencyLimit)
  }
  throw new TypeError(`${value} is not an Array`)
}

/**
 * @name map.withIndex
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var T any,
 *   index number,
 *   array Array<T>,
 *   indexedMapper (T, index, array)=>Promise|any
 *
 * map.withIndex(indexedMapper)(array) -> Promise|Array
 * ```
 *
 * @description
 * `map` with an indexed mapper.
 *
 * ```javascript [playground]
 * const range = length => map.withIndex(
 *   (_, index) => index + 1)(Array(length))
 *
 * console.log(range(5)) // [1, 2, 3, 4, 5]
 * ```
 *
 * @execution concurrent
 *
 * @related
 * map, filter.withIndex
 */
map.withIndex = mapper => function mappingWithIndex(value) {
  if (isArray(value)) {
    return arrayMapWithIndex(value, mapper)
  }
  throw new TypeError(`${value} is not an Array`)
}

module.exports = map
