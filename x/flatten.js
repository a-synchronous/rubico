const isArray = require('../_internal/isArray')
const arrayFlatten = require('../_internal/arrayFlatten')
const setFlatten = require('../_internal/setFlatten')
const objectFlatten = require('../_internal/objectFlatten')
const identity = require('../_internal/identity')
const flatMap = require('../flatMap')

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
 *
 * TODO flatten for each type
 */
const flatten = function (value) {
  if (isArray(value)) {
    return arrayFlatten(value)
  }
  if (value == null) {
    return value
  }
  if (value.constructor == Set) {
    return setFlatten(value)
  }
  if (value.constructor == Object) {
    return objectFlatten(value)
  }
  return flatMap(identity)(value)
}

module.exports = flatten
