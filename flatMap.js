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
 * type Monad = Array|string|Set|Generator|AsyncGenerator|{ flatMap: string }|{ chain: string }|Object
 *
 * type SyncOrAsyncFlatMapper = (
 *   item any,
 *   indexOrKey number|string|any,
 *   monad Monad
 * )=>(flatMappedItem Promise|Monad|any)
 *
 * flatMap(monad Promise|Monad, flatMapper SyncOrAsyncFlatMapper) -> flatMappedMonad Promise|Monad
 * flatMap(flatMapper SyncOrAsyncFlatMapper)(monad Monad) -> flatMappedMonad Promise|Monad
 * ```
 *
 * @description
 * Applies a flat-mapper function to each item of a monad, returning a flat-mapped monad of the same type.
 *
 * ```javascript [playground]
 * const duplicate = value => [value, value]
 *
 * const duplicated = flatMap([1, 2, 3, 4, 5], duplicate)
 *
 * console.log(duplicated)
 * ```
 *
 * `flatMap` iterates through each item of a monad and applies the flat-mapper function to each item, concatenating the execution result (flat-mapped item) into the flat-mapped monad. If the execution result is a promise, it is resolved for its value before being concatenated into the flat-mapped monad. If the execution result is asynchronously iterable, it is muxed into the flat-mapped monad.
 *
 * If the flat-mapper function is asynchronous, it is executed concurrently.
 *
 * The following data types are considered to be monads:
 *  * `array`
 *  * `string`
 *  * `set`
 *  * `generator`
 *  * `async generator`
 *  * `object with .flatMap method`
 *  * `object with .chain method`
 *  * `object`
 *
 * The flat-mapper function signature changes depending on the provided monad.
 *
 * If the monad is an array:
 * ```coffeescript [specscript]
 * flatMapper(item any, index number, monad Array) -> flatMappedItem Promise|Monad|any
 * ```
 *
 * If the monad is a string:
 * ```coffeescript [specscript]
 * flatMapper(character string, index number, monad string) -> flatMappedItem Promise|Monad|any
 * ```
 *
 * If the monad is a set:
 * ```coffeescript [specscript]
 * flatMapper(item any, item any, monad set) -> flatMappedItem Promise|Monad|any
 * ```
 *
 * If the monad is a generator:
 * ```coffeescript [specscript]
 * flatMapper(item any) -> flatMappedItem Monad|any
 * ```
 *
 * If the monad is an async generator:
 * ```coffeescript [specscript]
 * flatMapper(item any) -> flatMappedItem Promise|Monad|any
 * ```
 *
 * If the monad is a plain object:
 * ```coffeescript [specscript]
 * flatMapper(item any, key string, monad Object) -> flatMappedItem Promise|Monad|any
 * ```
 *
 * If the iterable is an object with a `flatMap` or `chain` method, the flat-mapper function signature is defined externally.
 *
 * Values from async generators are muxed. Muxing, or asynchronously "mixing", is the process of combining multiple asynchronous sources into one source, with order determined by the asynchronous resolution of the individual promise elements.
 *
 * For other types of monads, order is preserved from the original monad and applied to the flat-mapped items, which are then concatenated into the flat-mapped monad. The order of the items of a given flat-mapped item is determined by the structure of the flat-mapped item.
 *
 * ```javascript [playground]
 * const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
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
 * const muxed = await flatMap(['foo', 'bar', 'baz'], asyncRepeat3)
 *
 * console.log('muxed:', muxed)
 *
 * const repeat3 = function* (message) {
 *   yield message; yield message; yield message
 * }
 *
 * // values from generators and other monads are concatenated
 * const repeated = flatMap(['foo', 'bar', 'baz'], repeat3)
 *
 * console.log('repeated:', repeated)
 * ```
 *
 * If the monad is a promise, it is resolved for its value before further execution for the eager interface only.
 *
 * ```javascript [playground]
 * flatMap(Promise.resolve([1, 2, 3, 4, 5]), n => [n, n]).then(console.log)
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
