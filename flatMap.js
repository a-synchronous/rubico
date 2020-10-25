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
 * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: Reducer<T>=>any }|Object<T>
 *
 * var T any,
 *   flatMapper T=>Promise|Monad<T>|Foldable<T>|T,
 *   monad Monad<T>,
 *   args ...any,
 *   generatorFunction ...args=>Generator<Promise|T>,
 *   asyncGeneratorFunction ...args=>AsyncGenerator<T>,
 *   reducer Reducer<T>
 *
 * flatMap(flatMapper)(monad) -> Monad<T>
 *
 * flatMap(flatMapper)(generatorFunction) -> ...args=>Generator<T>
 *
 * flatMap(flatMapper)(asyncGeneratorFunction) -> ...args=>AsyncGenerator<T>
 *
 * flatMap(flatMapper)(reducer) -> Reducer<T>
 * ```
 *
 * @description
 * Apply a flatMapper concurrently to each item of a monad, flattening the items of each execution into a new monad that is the same type as the original.
 *
 * The following list outlines high level behavior for various input monads.
 *
 *  * `Array` - Apply a flatMapper to each item, pushing (`.push`) the items of each execution into a new array
 *  * `String` - Apply a flatMapper to each character, adding (`+`) the items of each execution into a new string
 *  * `Set` - Apply a flatMapper to each item, adding (`.add`) the items of each execution into a new set
 *  * `TypedArray` - Apply a flatMapper to each byte, setting (`.set`) the items of each execution into a new typed array
 *  * `Buffer (Node.js)` - Apply a flatMapper to each byte, setting (`.set`) the items of each execution into a new Node.js Buffer
 *  * `stream.Duplex (Node.js)` - Apply a flatMapper to each item, writing (`.write`) the items of each execution into a new duplex stream
 *  * `Object` - Apply a flatMapper to each value, assigning (`Object.assign`) the items of each execution into a new object
 *  * `Reducer` - Apply a flatMapper to each item of a reducer's reducing operation, calling each item of each execution with the reducer.
 *  * `{ chain: function }` - Call `.chain` directly with flatMapper
 *  * `{ flatMap: function }` - Call `.flatMap` directly with flatMapper
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
 * A flatMapping operation concatenates onto the result synchronous values and muxes any asynchronous values. Muxing, or asynchronously "mixing", is the process of combining multiple asynchronous sources into one source, with order determined by the asynchronous resolution of the individual items.
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
 * In general, flattening is by order of concatenation with the exception of async iterables, which are muxed. Below, the two `4`s are asynchronous and are pushed onto the result after all the synchronous values have been flattened.
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
 * Purer functional programming is possible with `flatMap` and explicit monads. An explicit monad is any object that defines a method `.chain` or `.flatMap`.
 *
 * ```javascript [playground]
 * const Maybe = value => ({
 *   chain(flatMapper) {
 *     return value == null ? value : flatMapper(value)
 *   },
 * })
 *
 * const userbase = new Map([
 *   ['1', { _id: '1', name: 'George' }],
 *   ['2', { _id: '2', name: 'Jane' }],
 *   ['3', { _id: '3', name: 'Jim' }],
 * ])
 *
 * const getUserByID = async userID => userbase.get(userID)
 *
 * const logUserByID = pipe([
 *   getUserByID,
 *   Maybe,
 *   flatMap(console.log),
 * ])
 *
 * logUserByID('5')
 *
 * logUserByID('1') // { _id: '1', name: 'George' }
 * ```
 *
 * Additionally, `flatMap` is a powerful option when working with transducers. A flatMapping transducer applies a flatMapper to each item of a reducer's reducing operation, calling each item of each execution with the reducer.
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
 * const arrayConcat = (array, value) => array.concat(value)
 *
 * console.log(
 *   reduce(oddPowers(arrayConcat), [])([1, 2, 3, 4, 5]),
 * ) // [1, 1, 1, 3, 9, 27, 5, 25, 125]
 * ```
 *
 * In the case above, each item of the array of numbers returned by `powers` is called with the reducer `arrayConcat` for flattening into the final result.
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

  if (typeof value.then == 'function') {
    return value.then(flatMapper)
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
