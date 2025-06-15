export = flatMap;
/**
 * @name flatMap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type FlatMappable = Array|String|Set|Iterator|AsyncIterator
 *
 * type Iterable = Iterable|AsyncIterable|Object<value any>
 *
 * type FlatMapper = (
 *   element any,
 *   indexOrKey string,
 *   collection FlatMappable
 * )=>Promise|FlatMappable
 *
 * flatMap(collection FlatMappable, flatMapper FlatMapper) -> result Promise|FlatMappable
 * flatMap(flatMapper FlatMapper)(collection FlatMappable) -> result Promise|FlatMappable
 * ```
 *
 * @description
 * Applies a flatMapper function concurrently to each element of a collection, creating a new collection of the same type. A flatMapping operation iterates through each element of a collection and applies the flatMapper function to each element, flattening the result of the execution into the result collection. The result of an individual execution can be any iterable, async iterable, or object values iterable collection. The flatMapper function may be asynchronous.
 *
 *  * `Iterable` - the execution result is iterated and each element is added to the result collection
 *  * `AsyncIterable` - the execution result is asynchronously iterated and each element is added to the result collection
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
 * A flatMapping operation concatenates onto the resulting collection synchronous values and muxes any asynchronous values. Muxing, or asynchronously "mixing", is the process of combining multiple asynchronous sources into one source, with order determined by the asynchronous resolution of the individual elements.
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
 * For arrays (type `Array`), `flatMap` applies the flatMapper function to each element, pushing (`.push`) the elements of each execution into a new array.
 *
 * ```javascript [playground]
 * const duplicate = value => [value, value]
 *
 * console.log(
 *   flatMap([1, 2, 3, 4, 5], duplicate)
 * ) // [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]
 * ```
 *
 * For strings (type `String`), `flatMap` applies the flatMapper function to each character, adding (`+`) the elements of each execution into a new string
 *
 * ```javascript [playground]
 * const duplicate = value => [value, value]
 *
 * console.log(
 *   flatMap('12345', duplicate)
 * ) // 1122334455
 * ```
 *
 * For sets (type `Set`), `flatMap` applies the flatMapper function to each element, adding (`.add`) the elements of each execution into a new set
 *
 * ```javascript [playground]
 * const pairPlus100 = value => [value, value + 100]
 *
 * console.log(
 *   flatMap(new Set([1, 2, 3, 4, 5]), pairPlus100)
 * ) // Set(10) { 1, 101, 2, 102, 3, 103, 4, 104, 5, 105 }
 * ```
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
declare function flatMap(...args: any[]): any;
