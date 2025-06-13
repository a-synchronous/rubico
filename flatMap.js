const isPromise = require('./_internal/isPromise')
const FlatMappingIterator = require('./_internal/FlatMappingIterator')
const FlatMappingAsyncIterator = require('./_internal/FlatMappingAsyncIterator')
const isArray = require('./_internal/isArray')
const arrayFlatMap = require('./_internal/arrayFlatMap')
const objectFlatMap = require('./_internal/objectFlatMap')
const setFlatMap = require('./_internal/setFlatMap')
const stringFlatMap = require('./_internal/stringFlatMap')
const symbolIterator = require('./_internal/symbolIterator')
const curry2 = require('./_internal/curry2')
const __ = require('./_internal/placeholder')

/**
 * @name _flatMap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Monad = Array|String|Set|Iterator|AsyncIterator
 * type Iterable = Iterable|AsyncIterable|Object<value any>
 *
 * _flatMap(
 *   m Monad,
 *   flatMapper (item any)=>Promise|Iterable,
 * ) -> result Promise|Monad
 * ```
 */
const _flatMap = function (value, flatMapper) {
  if (isArray(value)) {
    return arrayFlatMap(value, flatMapper)
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

/**
 * @name flatMap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Monad = Array|String|Set|Iterator|AsyncIterator
 *
 * type FlatMapper = (
 *   item any,
 *   indexOrKey string,
 *   m Monad
 * )=>Promise|Monad
 *
 * flatMap(m Monad, flatMapper FlatMapper) -> result Promise|Monad
 * flatMap(flatMapper FlatMapper)(m Monad) -> result Promise|Monad
 * ```
 *
 * @description
 * Applies a flatMapper function concurrently to each item of a collection, creating a new collection of the same type. A flatMapping operation iterates through each item of a collection and applies the flatMapper function to each item, flattening the result of the execution into the result collection. The result of an individual execution can be any iterable, async iterable, or object values iterable collection. The flatMapper function may be asynchronous.
 *
 *  * `Iterable` - the execution result is iterated and each item is added to the result collection
 *  * `AsyncIterable` - the execution result is asynchronously iterated and each item is added to the result collection
 *  * `Object` - the execution result values are added to the result collection
 *
 * The following example demonstrates various execution results being flattened into the same array.
 *
 * ```javascript [playground]
 * const identity = value => value
 *
 * flatMap(identity)([
 *   [1, 1], // array
 *   new Set([2, 2]), // set
 *   (function* () { yield 3; yield 3 })(), // generator
 *   (async function* () { yield 7; yield 7 })(), // asyncGenerator
 *   { a: 5, b: 5 }, // object
 *   new Uint8Array([8]), // typedArray
 * ]).then(console.log)
 * // [1, 1, 2, 3, 3, 5, 5, 8, 7, 7]
 * ```
 *
 * A flatMapping operation concatenates onto the resulting collection synchronous values and muxes any asynchronous values. Muxing, or asynchronously "mixing", is the process of combining multiple asynchronous sources into one source, with order determined by the asynchronous resolution of the individual items.
 *
 * ```javascript [playground]
 * const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
 *
 * const repeat3 = function* (message) {
 *   yield message; yield message; yield message
 * }
 *
 * console.log( // sync is concatenated
 *   flatMap(['foo', 'bar', 'baz'], repeat3),
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
 * // async is muxed
 * flatMap(['foo', 'bar', 'baz'], asyncRepeat3).then(console.log)
 * // ['foo', 'bar', 'baz', 'foo', 'bar', 'baz', 'foo', 'bar', 'baz']
 * ```
 *
 * For arrays (type `Array`), `flatMap` applies the flatMapper function to each item, pushing (`.push`) the items of each execution into a new array.
 *
 * ```javascript [playground]
 * const duplicate = value => [value, value]
 *
 * console.log(
 *   flatMap([1, 2, 3, 4, 5], duplicate)
 * ) // [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]
 * ```
 *
 * For strings (type `String`), `flatMap` applies the flatMapper function to each character, adding (`+`) the items of each execution into a new string
 *
 * ```javascript [playground]
 * const duplicate = value => [value, value]
 *
 * console.log(
 *   flatMap('12345', duplicate)
 * ) // 1122334455
 * ```
 *
 * For sets (type `Set`), `flatMap` applies the flatMapper function to each item, adding (`.add`) the items of each execution into a new set
 *
 * ```javascript [playground]
 * const pairPlus100 = value => [value, value + 100]
 *
 * console.log(
 *   flatMap(new Set([1, 2, 3, 4, 5]), pairPlus100)
 * ) // Set(10) { 1, 101, 2, 102, 3, 103, 4, 104, 5, 105 }
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * flatMap(Promise.resolve([1, 2, 3, 4, 5]), n => [n, n]).then(console.log)
 * // [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]
 * ```
 *
 * @execution concurrent
 *
 * @transducing
 *
 * @archive
 *  * For typed arrays (type [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray#typedarray_objects)) and Node.js buffers (type [`Buffer`](https://nodejs.org/api/buffer.html)), `flatMap` applies a flatMapper function to each value of the typed array/buffer, joining the result of each execution with `.set` into the resulting typed array
 *
 *  * For Node.js duplex streams (type [Stream](https://nodejs.org/api/stream.html#class-streamduplex)), `flatMap` applies a flatMapper function to each item of the stream, writing (`.write`) each item of each execution into the duplex stream
 */
const flatMap = (arg0, arg1) => {
  if (typeof arg0 == 'function') {
    return curry2(_flatMap, __, arg0)
  }
  return isPromise(arg0)
    ? arg0.then(curry2(_flatMap, __, arg1))
    : _flatMap(arg0, arg1)
}

module.exports = flatMap
