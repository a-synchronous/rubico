const flatMap = require('../flatMap')
const arrayFlatten = require('../_internal/arrayFlatten')
const setFlatten = require('../_internal/setFlatten')

const isArray = Array.isArray
const identity = value => value

const flatMapIdentity = flatMap(identity)

/**
 * @name flatten
 *
 * @synopsis
 * ```coffeescript [specscript]
 * DuplexStream = { read: function, write: function }
 * Monad = Array|String|Set
 *   |TypedArray|DuplexStream|Iterator|AsyncIterator
 *   |{ chain: function }|{ flatMap: function }|Object
 * Foldable = Iterable|AsyncIterable|{ reduce: function }
 * Reducer<T> = (any, T)=>Promise|any
 *
 * flatten<T>(value Monad<T>) -> result Monad
 *
 * flatten<T>(value GeneratorFunction<T>|AsyncGeneratorFunction<T>)
 *   -> flatteningGeneratorFunction GeneratorFunction<T>|AsyncGeneratorFunction<T>
 *
 * flatten<T>(value Reducer<T>) -> flatteningReducer Reducer
 * ```
 *
 * @description
 * Flatten a collection. The equivalent of `flatMap(identity)`.
 *
 * ```javascript
 * flatten([
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
 */
const flatten = value => isArray(value) ? arrayFlatten(value)
  : value == null ? value
  : value.constructor == Set ? setFlatten(value)
  : flatMapIdentity(value)
