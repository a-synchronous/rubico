const isPromise = require('./_internal/isPromise')
const MappingIterator = require('./_internal/MappingIterator')
const MappingAsyncIterator = require('./_internal/MappingAsyncIterator')
const __ = require('./_internal/placeholder')
const curry2 = require('./_internal/curry2')
const curry3 = require('./_internal/curry3')
const isArray = require('./_internal/isArray')
const isObject = require('./_internal/isObject')
const arrayMap = require('./_internal/arrayMap')
const stringMap = require('./_internal/stringMap')
const setMap = require('./_internal/setMap')
const mapMap = require('./_internal/mapMap')
const objectMap = require('./_internal/objectMap')
const arrayMapSeries = require('./_internal/arrayMapSeries')
const stringMapSeries = require('./_internal/stringMapSeries')
const objectMapSeries = require('./_internal/objectMapSeries')
const setMapSeries = require('./_internal/setMapSeries')
const mapMapSeries = require('./_internal/mapMapSeries')
const arrayMapPool = require('./_internal/arrayMapPool')
const stringMapPool = require('./_internal/stringMapPool')
const setMapPool = require('./_internal/setMapPool')
const mapMapPool = require('./_internal/mapMapPool')
const objectMapPool = require('./_internal/objectMapPool')
const objectMapEntries = require('./_internal/objectMapEntries')
const mapMapEntries = require('./_internal/mapMapEntries')
const symbolIterator = require('./_internal/symbolIterator')
const symbolAsyncIterator = require('./_internal/symbolAsyncIterator')

/**
 * @name _map
 *
 * @synopsis
 * ```coffeescript [specscript]
 * _map(
 *   array Array,
 *   arrayMapper (value any, index number, array Array)=>Promise|any
 * ) -> mappedArray Promise|Array
 *
 * _map(
 *   object Object,
 *   objectMapper (value any, key string, object Object)=>Promise|any
 * ) -> mappedObject Promise|Array
 *
 * _map(
 *   set Set,
 *   setMapper (value any, value, set Set)=>Promise|any
 * ) -> mappedSet Promise|Set
 *
 * _map(
 *   originalMap Map,
 *   mapMapper (value any, key any, originalMap Map)=>Promise|any
 * ) -> mappedMap Promise|Map
 * ```
 */

const _map = function (value, f) {
  if (isArray(value)) {
    return arrayMap(value, f)
  }
  if (value == null) {
    return value
  }

  if (typeof value.then == 'function') {
    return value.then(f)
  }
  if (typeof value.map == 'function') {
    return value.map(f)
  }
  if (typeof value == 'string' || value.constructor == String) {
    return stringMap(value, f)
  }
  if (value.constructor == Set) {
    return setMap(value, f)
  }
  if (value.constructor == Map) {
    return mapMap(value, f)
  }
  if (typeof value[symbolIterator] == 'function') {
    return MappingIterator(value[symbolIterator](), f)
  }
  if (typeof value[symbolAsyncIterator] == 'function') {
    return MappingAsyncIterator(value[symbolAsyncIterator](), f)
  }
  if (value.constructor == Object) {
    return objectMap(value, f)
  }
  return f(value)
}

/**
 * @name map
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Functor = Array|Set|Map|Generator|AsyncGenerator|{ map: function }|Object
 *
 * type SyncOrAsyncMapper = (
 *   element any,
 *   indexOrKey number|string|any,
 *   functor Functor
 * )=>(resultElement Promise|any)
 *
 * map(functor Promise|Functor, mapper SyncOrAsyncMapper) -> result Promise|Functor
 * map(mapper SyncOrAsyncMapper)(functor Functor) -> result Promise|Functor
 * ```
 *
 * @description
 * Applies a mapper function to each element of a functor, returning a functor of the same type with the mapped elements. The order of the elements is maintained.
 *
 * The following data types are considered to be functors:
 *  * `array`
 *  * `set`
 *  * `map`
 *  * `generator`
 *  * `async generator`
 *  * `object with .map method`
 *  * `object`
 *
 * The mapper function defines a mapping between a given element in the functor to a resulting element in the returned functor.
 *
 * ```javascript
 * const mapper = function (element) {
 *   // resultElement is the result of a mapping from element
 *   return resultElement
 * }
 * ```
 *
 * The mapper function signature changes depending on the provided functor.
 *
 * If the functor is an array:
 * ```coffeescript [specscript]
 * mapper(element any, index number, ftor Array) -> resultElement Promise|any
 * ```
 *
 * If the functor is a set:
 * ```coffeescript [specscript]
 * mapper(element any, element any, ftor Set) -> resultElement Promise|any
 * ```
 *
 * If the functor is a map:
 * ```coffeescript [specscript]
 * mapper(element any, key any, ftor Map) -> resultElement Promise|any
 * ```
 *
 * If the functor is a generator:
 * ```coffeescript [specscript]
 * mapper(element any) -> resultElement Promise|any
 * ```
 *
 * If the functor is an async generator:
 * ```coffeescript [specscript]
 * mapper(element any) -> resultElement Promise|any
 * ```
 *
 * If the functor is an object with a `.map` method, the mapper function signature is defined externally.
 *
 * If the functor is a plain object:
 * ```coffeescript [specscript]
 * mapper(element any, key string, ftor Object) -> resultElement Promise|any
 * ```
 *
 * `map` works for arrays.
 *
 * ```javascript [playground]
 * const square = number => number ** 2
 *
 * const array = [1, 2, 3, 4, 5]
 *
 * const result = map(array, square)
 * console.log(result) // [1, 4, 9, 16, 25]
 * ```
 *
 * The mapper function may be asynchronous, in which case it is applied concurrently.
 *
 * ```javascript [playground]
 * const asyncSquare = async number => number ** 2
 *
 * const array = [1, 2, 3, 4, 5]
 *
 * const promise = map(array, asyncSquare)
 * promise.then(console.log) // [1, 4, 9, 16, 25]
 * ```
 *
 * `map` applies the mapper function to just the values of an object.
 *
 * ```javascript [playground]
 * const square = number => number ** 2
 *
 * const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 }
 *
 * const result = map(obj, square)
 * console.log(result) // { a: 1, b: 4, c: 9, d: 16, e: 25 }
 * ```
 *
 * `map` applies the mapper function to the values of the entries of a map.
 *
 * ```javascript [playground]
 * const square = number => number ** 2
 *
 * const m = new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]])
 *
 * const result = map(m, square)
 * console.log(result) // Map { 'a' => 1, 'b' => 4, 'c' => 9, 'd' => 16, 'e' => 25 }
 * ```
 *
 * `map` applies the mapper function lazily to each value of a generator, creating a new generator with mapped elements.
 *
 * ```javascript [playground]
 * const capitalize = string => string.toUpperCase()
 *
 * const abcGeneratorFunc = function* () {
 *   yield 'a'; yield 'b'; yield 'c'
 * }
 *
 * const abcGenerator = abcGeneratorFunc()
 * const ABCGenerator = map(abcGeneratorFunc(), capitalize)
 *
 * console.log([...abcGenerator]) // ['a', 'b', 'c']
 *
 * console.log([...ABCGenerator]) // ['A', 'B', 'C']
 * ```
 *
 * `map` applies the mapper function lazily to each value of an async generator, creating a new async generator with mapped elements.
 *
 * ```javascript [playground]
 * const capitalize = string => string.toUpperCase()
 *
 * const abcAsyncGeneratorFunc = async function* () {
 *   yield 'a'; yield 'b'; yield 'c'
 * }
 *
 * const abcAsyncGenerator = abcAsyncGeneratorFunc()
 * const ABCGenerator = map(abcAsyncGeneratorFunc(), capitalize)
 *
 * ;(async function () {
 *   for await (const letter of abcAsyncGenerator) {
 *     console.log(letter)
 *     // a
 *     // b
 *     // c
 *   }
 *
 *   for await (const letter of ABCGenerator) {
 *     console.log(letter)
 *     // A
 *     // B
 *     // C
 *   }
 * })()
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * const asyncSquare = async n => n ** 2
 *
 * map(Promise.resolve([1, 2, 3, 4, 5]), asyncSquare).then(console.log)
 * // [1, 4, 9, 16, 25]
 * ```
 *
 * See also:
 *  * [forEach](/docs/forEach)
 *  * [map.entries](/docs/map.entries)
 *  * [map.series](/docs/map.series)
 *  * [map.pool](/docs/map.pool)
 *  * [filter](/docs/filter)
 *  * [reduce](/docs/reduce)
 *  * [transform](/docs/transform)
 *  * [flatMap](/docs/flatMap)
 *  * [some](/docs/some)
 *
 * @execution concurrent
 *
 * @TODO streamMap
 */
const map = function (arg0, arg1) {
  if (arg1 == null) {
    return curry2(_map, __, arg0)
  }
  return isPromise(arg0)
    ? arg0.then(curry2(_map, __, arg1))
    : _map(arg0, arg1)
}

// _mapEntries(value Object|Map, f function) -> Object|Map
const _mapEntries = (value, f) => {
  if (value == null) {
    throw new TypeError('value is not an Object or Map')
  }
  if (value.constructor == Object) {
    return objectMapEntries(value, f)
  }
  if (value.constructor == Map) {
    return mapMapEntries(value, f)
  }
  throw new TypeError('value is not an Object or Map')
}

/**
 * @name map.entries
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type FunctorWithEntries = Map|Object
 *
 * type EntryMapper = (
 *   entry [key string|any, value any],
 * )=>(resultEntry Promise|[resultKey string|any, resultElement any])
 *
 * map.entries(
 *   value Promise|FunctorWithEntries,
 *   mapper EntryMapper
 * ) -> Promise|FunctorWithEntries
 *
 * map.entries(mapper EntryMapper)(value FunctorWithEntries)
 *   -> Promise|FunctorWithEntries
 * ```
 *
 * @description
 * `map` over the entries of a functor as opposed to the values.
 *
 * The following data types are considered to be functors with entries:
 *   * `map`
 *   * `object`
 *
 * The signature of the mapper function changes depending on the provided functor:
 *
 * If the functor is a map:
 *
 * ```coffeescript [specscript]
 * mapper(entry [key any, value any]) -> resultEntry Promise|[
 *   resultKey any,
 *   resultValue any,
 * ]
 * ```
 *
 * If the functor is an object:
 *
 * ```coffeescript [specscript]
 * mapper(entry [key string, value any]) -> resultEntry Promise|[
 *   resultKey string,
 *   resultValue any,
 * ]
 * ```
 *
 * `map.entries` works for objects and maps.
 *
 * ```javascript [playground]
 * const upperCaseKeysAndSquareValues =
 *   map.entries(([key, value]) => [key.toUpperCase(), value ** 2])
 *
 * console.log(upperCaseKeysAndSquareValues({ a: 1, b: 2, c: 3 }))
 * // { A: 1, B: 4, C: 9 }
 *
 * console.log(upperCaseKeysAndSquareValues(new Map([['a', 1], ['b', 2], ['c', 3]])))
 * // Map(3) { 'A' => 1, 'B' => 4, 'C' => 9 }
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * const asyncSquareEntries = async ([k, v]) => [k, v ** 2]
 *
 * map.entries(
 *   Promise.resolve({ a: 1, b: 2, c: 3 }),
 *   asyncSquareEntries,
 * ).then(console.log)
 * // { a: 1, b: 4, c: 9 }
 * ```
 *
 * See also:
 *  * [forEach](/docs/forEach)
 *  * [map](/docs/map)
 *  * [map.series](/docs/map.series)
 *  * [map.pool](/docs/map.pool)
 *  * [filter](/docs/filter)
 *  * [reduce](/docs/reduce)
 *  * [transform](/docs/transform)
 *  * [flatMap](/docs/flatMap)
 *  * [some](/docs/some)
 *
 * @since v1.7.0
 */
map.entries = function mapEntries(arg0, arg1) {
  if (arg1 == null) {
    return curry2(_mapEntries, __, arg0)
  }
  return isPromise(arg0)
    ? arg0.then(curry2(_mapEntries, __, arg1))
    : _mapEntries(arg0, arg1)
}

/**
 * @name _mapSeries
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Functor = Array|Object|Set|Map
 *
 * type SyncOrAsyncMapper = (
 *   value any,
 *   indexOrKey number|string|any,
 *   f Functor
 * )=>(mappedElement Promise|any)
 *
 * _mapSeries(f Functor, f SyncOrAsyncMapper) -> result Promise|Functor
 * ```
 */
const _mapSeries = function (collection, f) {
  if (isArray(collection)) {
    return arrayMapSeries(collection, f)
  }
  if (collection == null) {
    throw new TypeError(`invalid collection ${collection}`)
  }

  if (typeof collection == 'string' || collection.constructor == String) {
    return stringMapSeries(collection, f)
  }
  if (collection.constructor == Set) {
    return setMapSeries(collection, f)
  }
  if (collection.constructor == Map) {
    return mapMapSeries(collection, f)
  }
  if (collection.constructor == Object) {
    return objectMapSeries(collection, f)
  }
  throw new TypeError(`invalid collection ${collection}`)
}

/**
 * @name map.series
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type MapSeriesFunctor = Array|Object|Set|Map
 *
 * type SyncOrAsyncMapper = (
 *   value any,
 *   indexOrKey number|string|any,
 *   ftor MapSeriesFunctor,
 * )=>(mappedElement Promise|any)
 *
 * map.series(
 *   ftor Promise|MapSeriesFunctor,
 *   mapper SyncOrAsyncMapper
 * ) -> result MapSeriesFunctor
 *
 * map.series(mapper SyncOrAsyncMapper)(ftor MapSeriesFunctor)
 *   -> result MapSeriesFunctor
 * ```
 *
 * @description
 * [map](/docs/map) with serial execution.
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
 * map.series([1, 2, 3, 4, 5], delayedLog)
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * const asyncSquare = async n => n ** 2
 *
 * map.series(Promise.resolve([1, 2, 3, 4, 5]), asyncSquare).then(console.log)
 * // [1, 4, 9, 16, 25]
 * ```
 *
 * See also:
 *  * [forEach](/docs/forEach)
 *  * [map](/docs/map)
 *  * [map.entries](/docs/map.entries)
 *  * [map.pool](/docs/map.pool)
 *  * [filter](/docs/filter)
 *  * [reduce](/docs/reduce)
 *  * [transform](/docs/transform)
 *  * [flatMap](/docs/flatMap)
 *  * [some](/docs/some)
 *
 * @execution series
 */
map.series = function mapSeries(arg0, arg1) {
  if (arg1 == null) {
    return curry2(_mapSeries, __, arg0)
  }
  return isPromise(arg0)
    ? arg0.then(curry2(_mapSeries, __, arg1))
    : _mapSeries(arg0, arg1)
}

/**
 * @name _mapPool
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Functor = Array|Object|Set|Map
 *
 * _mapPool(f Functor, concurrency number, mapper function) -> result Promise|Functor
 * ```
 */
const _mapPool = function (f, concurrency, mapper) {
  if (isArray(f)) {
    return arrayMapPool(f, concurrency, mapper)
  }
  if (f == null) {
    throw new TypeError(`invalid functor ${f}`)
  }
  if (typeof f == 'string' || f.constructor == String) {
    return stringMapPool(f, concurrency, mapper)
  }
  if (f.constructor == Set) {
    return setMapPool(f, concurrency, mapper)
  }
  if (f.constructor == Map) {
    return mapMapPool(f, concurrency, mapper)
  }
  if (f.constructor == Object) {
    return objectMapPool(f, concurrency, mapper)
  }
  throw new TypeError(`invalid functor ${f}`)
}

/**
 * @name map.pool
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type MapPoolFunctor = Array|Object|Set|Map
 *
 * type SyncOrAsyncMapper = (
 *   element any,
 *   indexOrKey number|string|any,
 *   ftor Functor
 * )=>(resultElement Promise|any)
 *
 * map.pool(
 *   ftor MapPoolFunctor,
 *   concurrency number,
 *   mapper SyncOrAsyncMapper
 * ) -> result Promise|Array
 *
 * map.pool(
 *   concurrency number,
 *   mapper SyncOrAsyncMapper
 * )(ftor MapPoolFunctor) -> result Promise|Array
 * ```
 *
 * @description
 * [map](/docs/map) with limited [concurrency](https://web.mit.edu/6.005/www/fa14/classes/17-concurrency/).
 *
 * ```javascript [playground]
 * const ids = [1, 2, 3, 4, 5]
 *
 * const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
 *
 * const delayedIdentity = async value => {
 *   await sleep(1000)
 *   return value
 * }
 *
 * map.pool(2, pipe([
 *   delayedIdentity,
 *   console.log,
 * ]))(ids)
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * const asyncSquare = async n => n ** 2
 *
 * map.pool(Promise.resolve([1, 2, 3, 4, 5]), 5, asyncSquare).then(console.log)
 * // [1, 4, 9, 16, 25]
 * ```
 *
 * See also:
 *  * [forEach](/docs/forEach)
 *  * [map](/docs/map)
 *  * [map.entries](/docs/map.entries)
 *  * [map.series](/docs/map.series)
 *  * [filter](/docs/filter)
 *  * [reduce](/docs/reduce)
 *  * [transform](/docs/transform)
 *  * [flatMap](/docs/flatMap)
 *  * [some](/docs/some)
 *
 * @TODO objectMapPool
 *
 * @execution concurrent
 */
map.pool = function mapPool(arg0, arg1, arg2) {
  if (arg2 == null) {
    return curry3(_mapPool, __, arg0, arg1)
  }
  return isPromise(arg0)
    ? arg0.then(curry3(_mapPool, __, arg1, arg2))
    : _mapPool(arg0, arg1, arg2)
}

/**
 * @name map.rate
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Functor = Array|Object|Set|Map
 *
 * map.rate(
 *   rate number,
 *   f (value any)=>Promise|any,
 * )(f Functor) -> result Promise|Array
 *
 * map.rate(
 *   f Functor,
 *   rate number,
 *   f (value any)=>Promise|any,
 * ) -> result Promise|Array
 * ```
 */

module.exports = map
