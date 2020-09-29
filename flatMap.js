const FlatMappingIterator = require('./_internal/FlatMappingIterator')
const FlatMappingAsyncIterator = require('./_internal/FlatMappingAsyncIterator')
const isArray = require('./_internal/isArray')
const isGeneratorFunction = require('./_internal/isGeneratorFunction')
const isAsyncGeneratorFunction = require('./_internal/isAsyncGeneratorFunction')
const isBinary = require('./_internal/isBinary')
const arrayFlatMap = require('./_internal/arrayFlatMap')
const objectFlatMap = require('./_internal/objectFlatMap')
const setFlatMap = require('./_internal/setFlatMap')
const stringFlatMap = require('./_internal/stringFlatMap')
const streamFlatMap = require('./_internal/streamFlatMap')
const binaryFlatMap = require('./_internal/binaryFlatMap')
const reducerFlatMap = require('./_internal/reducerFlatMap')
const generatorFunctionFlatMap = require('./_internal/generatorFunctionFlatMap')
const asyncGeneratorFunctionFlatMap = require('./_internal/asyncGeneratorFunctionFlatMap')
const symbolIterator = require('./_internal/symbolIterator')
const symbolAsyncIterator = require('./_internal/symbolAsyncIterator')

/**
 * @name flatMap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Stream<T> = { read: ()=>T, write: T=>() }
 * Monad<T> = Array<T>|String<T>|Set<T>
 *   |TypedArray<T>|Stream<T>|Iterator<T>|AsyncIterator<T>
 *   |{ chain: T=>Monad<T> }|{ flatMap: T=>Monad<T> }|Object<T>
 * Reducer<T> = (any, T)=>Promise|any
 * Foldable<T> = Iterable<T>|AsyncIterable<T>
 *   |{ reduce: Reducer<T>=>any }|Object<T>
 *
 * flatMap<
 *   T any,
 *   flatMapper T=>Promise|Monad<T>|Foldable<T>|T,
 *   monad Monad<T>,
 *   args ...any,
 *   generatorFunction ...args=>Generator<Promise|T>,
 *   reducer Reducer<T>,
 * >(flatMapper)(monad) -> anotherMonad Monad<T>
 *
 * flatMap(flatMapper)(generatorFunction) ->
 *   flatMappingGeneratorFunction ...args=>Generator<Promise|T>
 *
 * flatMap(flatMapper)(reducer) -> flatMappingReducer Reducer<T>
 * ```
 *
 * @description
 * Apply a function to each item of a collection, flattening any resulting collection. The result is always the same type as the input value with all items mapped and flattened. The following outlines behavior for various collections.
 *
 *   * `Array` - map items then flatten results into a new `Array`
 *   * `String|string` - map items then flatten (`+`) results into a new `string`
 *   * `Set` - map items then flatten results into a new `Set`
 *   * `TypedArray` - map items then flatten results into a new `TypedArray`
 *   * `Buffer (Node.js)` - map items then flatten results into a new `Buffer`
 *   * `stream.Duplex (Node.js)` - map over stream items by async iteration, then call stream's `.write` to flatten
 *   * `{ chain: function }`, i.e. object that implements `.chain` - this function is called directly
 *   * `{ flatMap: function }`, i.e. object that implements `.flatMap` - this function is called directly
 *   * `Object` - a plain Object, values are mapped then flattened into result by `Object.assign`
 *   * `Reducer` - a function to be used in a reducing operation. Items of a flatMapped reducing operation are mapped then flattened into the aggregate
 *
 * On arrays, map the flatMapper function with concurrent asynchronous execution, then flatten the result one depth.
 *
 * ```javascript [playground]
 * const duplicate = number => [number, number]
 *
 * console.log(
 *   flatMap(duplicate)([1, 2, 3, 4, 5]),
 * ) // [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]
 *
 * const asyncDuplicate = async number => [number, number]
 *
 * flatMap(asyncDuplicate)( // concurrent execution
 *   [1, 2, 3, 4, 5]).then(console.log) // [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]
 * ```
 *
 * Collections returned by the flatMapper are flattened into the result by type-specific iteration and concatenation, while async iterables are muxed. Muxing, or asynchronously "mixing", is the process of combining multiple asynchronous sources into one source, with order determined by the asynchronous resolution of the individual items. This behavior is useful for working with asynchronous streams, e.g. of DOM events or requests.
 *
 * ```javascript [playground]
 * const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
 *
 * const repeat3 = function* (message) {
 *   yield message; yield message; yield message
 * }
 *
 * console.log( // sync is concatenated
 *   flatMap(repeat3)(['foo', 'bar', 'baz']),
 * ) // ['foo', 'foo', 'foo', 'bar', 'bar', 'bar', 'baz', 'baz', 'baz']
 *
 * const asyncRepeat3 = async function* (message) {
 *   yield message
 *   await sleep(100)
 *   yield message
 *   await sleep(1000)
 *   yield message
 * }
 *
 * flatMap(asyncRepeat3)( // async is muxed
 *   ['foo', 'bar', 'baz']).then(console.log)
 * // ['foo', 'bar', 'baz', 'foo', 'bar', 'baz', 'foo', 'bar', 'baz']
 * ```
 *
 * Upon flatMapper execution, flatten any collection return into the result.
 *
 *   * Iterable - items are concatenated into the result
 *   * Iterator/Generator - items are concatenated into the result. Source is consumed.
 *   * Object that implements `.reduce` - this function is called directly for flattening
 *   * Object that implements `.chain` or `.flatMap` - either of these is called directly to flatten
 *   * any other Object - values are flattened
 *   * AsyncIterable - items are muxed by asynchronous resolution
 *   * AsyncIterator/AsyncGenerator - items are muxed by asynchronous resolution. Source is consumed.
 *
 * All other types are left in the result as they are.
 *
 * ```javascript [playground]
 * const identity = value => value
 *
 * flatMap(identity)([
 *   [1, 1],
 *   new Set([2, 2]),
 *   (function* () { yield 3; yield 3 })(),
 *   (async function* () { yield 4; yield 4 })(),
 *   { a: 5, b: 5 },
 *   6,
 *   Promise.resolve(7),
 *   new Uint8Array([8]),
 * ]).then(console.log)
 * // [1, 1, 2, 3, 3, 5, 5, 6, 7, 8, 4, 4]
 * ```
 *
 * Purer functional programming is possible with flatMap operation on monads. A monad could be any object that implements `.chain` or `.flatMap`. When a flatMapping operation encounters a monad, it calls the monad's `.chain` method directly to flatten.
 *
 * ```javascript [playground]
 * const Maybe = value => ({
 *   chain(flatMapper) {
 *     return value == null ? value : flatMapper(value)
 *   },
 * })
 *
 * flatMap(console.log)(Maybe(null))
 *
 * flatMap(console.log)(Maybe('hello world')) // hello world
 * ```
 *
 * In addition to monads, `flatMap` is a powerful option when working with transducers as well. A flatMapping transducer is like a mapping transducer except all items of the reducing operation are additionally flattened into the result.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const powers = number => [number, number ** 2, number ** 3]
 *
 * const oddPowers = pipe([
 *   filter(isOdd),
 *   flatMap(powers),
 * ])
 *
 * console.log(
 *   transform(oddPowers, [])([1, 2, 3, 4, 5]),
 * ) // [1, 1, 1, 3, 9, 27, 5, 25, 125]
 *
 * const asyncPowers = async number => [number, number ** 2, number ** 3]
 *
 * const asyncOddPowers = pipe([
 *   filter(isOdd),
 *   flatMap(asyncPowers),
 * ])
 *
 * transform(asyncOddPowers, [])([1, 2, 3, 4, 5]).then(console.log)
 * // [1, 1, 1, 3, 9, 27, 5, 25, 125]
 * ```
 *
 * @execution concurrent
 *
 * @transducing
 */
const flatMap = flatMapper => function flatMapping(value) {
  if (isArray(value)) {
    return arrayFlatMap(value, flatMapper)
  }
  if (typeof value == 'function') {
    if (isGeneratorFunction(value)) {
      return generatorFunctionFlatMap(value, flatMapper)
    }
    if (isAsyncGeneratorFunction(value)) {
      return asyncGeneratorFunctionFlatMap(value, flatMapper)
    }
    return reducerFlatMap(value, flatMapper)
  }
  if (isBinary(value)) {
    return binaryFlatMap(value, flatMapper)
  }
  if (value == null) {
    return flatMapper(value)
  }

  if (typeof value.next == 'function') {
    return symbolIterator in value
      ? FlatMappingIterator(value, flatMapper)
      : FlatMappingAsyncIterator(value, flatMapper)
  }
  if (typeof value.chain == 'function') {
    return value.chain(flatMapper)
  }
  if (typeof value.flatMap == 'function') {
    return value.flatMap(flatMapper)
  }
  if (
    typeof value[symbolAsyncIterator] == 'function'
      && typeof value.write == 'function'
  ) {
    return streamFlatMap(value, flatMapper)
  }
  const valueConstructor = value.constructor
  if (valueConstructor == Object) {
    return objectFlatMap(value, flatMapper)
  }
  if (valueConstructor == Set) {
    return setFlatMap(value, flatMapper)
  }
  if (typeof value == 'string' || valueConstructor == String) {
    return stringFlatMap(value, flatMapper)
  }
  return flatMapper(value)
}

module.exports = flatMap
