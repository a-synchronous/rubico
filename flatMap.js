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
 * type Monad = Array|String|Set|Generator|AsyncGenerator
 * type Iterable = Iterable|AsyncIterable|Object<value any>
 *
 * _flatMap(
 *   m Monad,
 *   flatMapper (element any)=>Promise|Iterable,
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
 * type Monad = Array|String|Set|Generator|AsyncGenerator|{ flatMap: string }|{ chain: string }|Object
 *
 * type SyncOrAsyncFlatMapper = (
 *   element any,
 *   indexOrKey number|string|any,
 *   monad Monad
 * )=>Promise|Monad|any
 *
 * flatMapper SyncOrAsyncFlatMapper
 *
 * flatMap(monad Promise|Monad, flatMapper) -> result Promise|Monad
 * flatMap(flatMapper)(monad Monad) -> result Promise|Monad
 * ```
 *
 * @description
 * Applies a flatMapper function to each element of a monad, returning a monad of the same type.
 *
 * A flatMapping operation iterates through each element of a monad and applies the flatMapper function to each element, flattening the result of the execution into the returned monad.
 *
 * If the flatMapper is asynchronous, it is executed concurrently. The execution result may be asynchronously iterable, in which case it is muxed into the returned monad.
 *
 * The following data types are considered to be monads, all are flattenable into other monads:
 *  * `array`
 *  * `string`
 *  * `set`
 *  * `genreator`
 *  * `async generator`
 *  * `object with .flatMap method`
 *  * `object with .chain method`
 *  * `object`
 *
 * `flatMap` flattens various data types.
 *
 * ```javascript [playground]
 * const identity = value => value
 *
 * flatMap(identity)([
 *   [1, 1], // array
 *   new Set([2, 2]), // set
 *   (function* () { yield 3; yield 3 })(),
 *   (async function* () { yield 7; yield 7 })(),
 *   { a: 5, b: 5 }, // object
 *   new Uint8Array([8]), // typedArray
 * ]).then(console.log)
 * // [1, 1, 2, 3, 3, 5, 5, 8, 7, 7]
 * ```
 *
 * Values from async generators are muxed. Muxing, or asynchronously "mixing", is the process of combining multiple asynchronous sources into one source, with order determined by the asynchronous resolution of the individual promise elements.
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
 * // values from async generators are muxed
 * flatMap(['foo', 'bar', 'baz'], asyncRepeat3).then(console.log)
 * // ['foo', 'bar', 'baz', 'foo', 'bar', 'baz', 'foo', 'bar', 'baz']
 * ```
 *
 * `flatMap` applies the flatMapper function to each element of an array, flattening the results into a new array.
 *
 * ```javascript [playground]
 * const duplicate = value => [value, value]
 *
 * console.log(
 *   flatMap([1, 2, 3, 4, 5], duplicate)
 * ) // [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]
 * ```
 *
 * `flatMap` acts on each character of a string.
 *
 * ```javascript [playground]
 * const duplicate = value => [value, value]
 *
 * console.log(
 *   flatMap('12345', duplicate)
 * ) // 1122334455
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * flatMap(Promise.resolve([1, 2, 3, 4, 5]), n => [n, n]).then(console.log)
 * // [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]
 * ```
 *
 * See also:
 *  * [forEach](/docs/forEach)
 *  * [map](/docs/map)
 *  * [filter](/docs/filter)
 *  * [reduce](/docs/reduce)
 *  * [transform](/docs/transform)
 *  * [some](/docs/some)
 *
 * @execution concurrent
 *
 * @transducing
 *
 * @archive
 *  * For typed arrays (type [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray#typedarray_objects)) and Node.js buffers (type [`Buffer`](https://nodejs.org/api/buffer.html)), `flatMap` applies a flatMapper function to each value of the typed array/buffer, joining the result of each execution with `.set` into the resulting typed array
 *
 *  * For Node.js duplex streams (type [Stream](https://nodejs.org/api/stream.html#class-streamduplex)), `flatMap` applies a flatMapper function to each element of the stream, writing (`.write`) each element of each execution into the duplex stream
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
