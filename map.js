const isPromise = require('./_internal/isPromise')
const MappingIterator = require('./_internal/MappingIterator')
const MappingAsyncIterator = require('./_internal/MappingAsyncIterator')
const SerialMappingAsyncIterator = require('./_internal/SerialMappingAsyncIterator')
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
  if (typeof value.map == 'function') {
    return value.map(f)
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
 *   item any,
 *   indexOrKey number|string|any,
 *   functor Functor
 * )=>(mappedItem Promise|any)
 *
 * map(functor Promise|Functor, mapper SyncOrAsyncMapper) -> mappedFunctor Promise|Functor
 * map(mapper SyncOrAsyncMapper)(functor Functor) -> mappedFunctor Promise|Functor
 * ```
 *
 * @description
 * Applies a mapper function to each item of a functor, returning a mapped functor of the same type with the mapped items. The order of the items of the functor is preserved.
 *
 * ```javascript [playground]
 * const square = number => number ** 2
 *
 * const array = [1, 2, 3, 4, 5]
 * const object = { a: 1, b: 2, c: 3 }
 *
 * const mappedArray = map(array, square)
 * const mappedObject = map(object, square)
 *
 * console.log(mappedArray)
 * console.log(mappedObject)
 * ```
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
 * The mapper function defines a mapping between a given item and an item in the returned functor.
 *
 * ```javascript
 * const mapper = function (item) {
 *   // ...
 *   // mappedItem is mapped from item
 *   return mappedItem
 * }
 * ```
 *
 * The mapper function signature changes depending on the provided functor.
 *
 * If the functor is an array:
 * ```coffeescript [specscript]
 * mapper(item any, index number, functor Array) -> mappedItem Promise|any
 * ```
 *
 * If the functor is a set:
 * ```coffeescript [specscript]
 * mapper(item any, item any, functor Set) -> mappedItem Promise|any
 * ```
 *
 * If the functor is a map:
 * ```coffeescript [specscript]
 * mapper(item any, key any, functor Map) -> mappedItem Promise|any
 * ```
 *
 * If the functor is a generator:
 * ```coffeescript [specscript]
 * mapper(item any) -> mappedItem any
 * ```
 *
 * If the functor is an async generator:
 * ```coffeescript [specscript]
 * mapper(item any) -> mappedItem Promise|any
 * ```
 *
 * If the functor is a plain object:
 * ```coffeescript [specscript]
 * mapper(item any, key string, functor Object) -> mappedItem Promise|any
 * ```
 *
 * If the functor is an object with a `.map` method, the mapper function signature is defined externally.
 *
 * If the functor is a generator, the mapper function must be synchronous.
 *
 * If the mapper function is asynchronous, it is executed concurrently.
 *
 * ```javascript [playground]
 * const asyncSquare = async number => number ** 2
 *
 * const array = [1, 2, 3, 4, 5]
 *
 * const result = await map(array, asyncSquare)
 *
 * console.log(result)
 * ```
 *
 * `map` iterates over just the values of objects and maps.
 *
 * ```javascript [playground]
 * const square = number => number ** 2
 *
 * const object = { a: 1, b: 2, c: 3, d: 4, e: 5 }
 * const m = new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]])
 *
 * const mappedObject = map(object, square)
 * const mappedMap = map(m, square)
 *
 * console.log(mappedObject)
 * console.log(mappedMap)
 * ```
 *
 * `map` maps each value of a generator, creating a new generator with mapped items.
 *
 * ```javascript [playground]
 * const capitalize = string => string.toUpperCase()
 *
 * async function* generateAlphabet() {
 *   for (let i = 0; i < 26; i++) {
 *     yield String.fromCharCode(97 + i)
 *   }
 * }
 *
 * const alphabet = generateAlphabet()
 * const uppercaseAlphabet = map(generateAlphabet(), capitalize)
 *
 * console.log('alphabet')
 * for await (const letter of alphabet) {
 *   console.log(letter)
 * }
 *
 * console.log('uppercase alphabet')
 * for await (const letter of uppercaseAlphabet) {
 *   console.log(letter)
 * }
 * ```
 *
 * If the functor is a promise, it is resolved for its value before further execution for the eager interface only.
 *
 * ```javascript [playground]
 * const asyncSquare = async n => n ** 2
 *
 * map(Promise.resolve([1, 2, 3, 4, 5]), asyncSquare).then(console.log)
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
 * type FunctorOfEntries = Map|Object
 *
 * type EntryMapper = (
 *   entry [key any, value any],
 * )=>(mappedEntry Promise|[mappedKey any, mappedValue any])
 *
 * map.entries(
 *   functorOfEntries Promise|FunctorOfEntries,
 *   mapper EntryMapper
 * ) -> mappedFunctorWithEntries Promise|FunctorOfEntries
 *
 * map.entries(mapper EntryMapper)(functorOfEntries FunctorOfEntries)
 *   -> mappedFunctorWithEntries Promise|FunctorOfEntries
 * ```
 *
 * @description
 * [map](/docs/map) that applies the mapper function to the entries of a functor as opposed to the values.
 *
 * ```javascript [playground]
 * const upperCaseKeysAndSquareValues =
 *   map.entries(([key, value]) => [key.toUpperCase(), value ** 2])
 *
 * const object = { a: 1, b: 2, c: 3 }
 *
 * console.log(upperCaseKeysAndSquareValues(object))
 *
 * const m = new Map([['a', 1], ['b', 2], ['c', 3]])
 *
 * console.log(upperCaseKeysAndSquareValues(m))
 * ```
 *
 * The following data types are considered to be functors with entries:
 *   * `map`
 *   * `object`
 *
 * The signature of the mapper function changes depending on the provided functor:
 *
 * If the functor is a map:
 * ```coffeescript [specscript]
 * mapper(entry [key any, value any]) ->
 *   mappedEntry Promise|[mappedKey any, mappedValue any]
 * ```
 *
 * If the functor is an object:
 * ```coffeescript [specscript]
 * mapper(entry [key string, value any]) ->
 *   mappedEntry Promise|[mappedKey string, mappedValue any]
 * ```
 *
 * If the functor with entries is a promise, it is resolved for its value before further execution for the eager interface only.
 *
 * ```javascript [playground]
 * const asyncSquareEntries = async ([k, v]) => [k, v ** 2]
 *
 * map.entries(
 *   Promise.resolve({ a: 1, b: 2, c: 3 }),
 *   asyncSquareEntries
 * ).then(console.log)
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
 * )=>(mappedItem Promise|any)
 *
 * _mapSeries(f Functor, f SyncOrAsyncMapper) -> result Promise|Functor
 * ```
 */
const _mapSeries = function (functor, f) {
  if (isArray(functor)) {
    return arrayMapSeries(functor, f)
  }
  if (functor == null) {
    throw new TypeError(`invalid functor ${functor}`)
  }

  if (typeof functor == 'string' || functor.constructor == String) {
    return stringMapSeries(functor, f)
  }
  if (functor.constructor == Set) {
    return setMapSeries(functor, f)
  }
  if (functor.constructor == Map) {
    return mapMapSeries(functor, f)
  }
  if (typeof functor[symbolIterator] == 'function') {
    return MappingIterator(functor[symbolIterator](), f)
  }
  if (typeof functor[symbolAsyncIterator] == 'function') {
    return SerialMappingAsyncIterator(functor[symbolAsyncIterator](), f)
  }
  if (typeof functor.map == 'function') {
    return functor.map(f)
  }
  if (functor.constructor == Object) {
    return objectMapSeries(functor, f)
  }
  throw new TypeError(`invalid functor ${functor}`)
}

/**
 * @name map.series
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Functor = Array|Set|Map|Generator|AsyncGenerator|{ map: function }|Object
 *
 * type SyncOrAsyncMapper = (
 *   value any,
 *   indexOrKey number|string|any,
 *   functor Functor,
 * )=>(mappedItem Promise|any)
 *
 * map.series(
 *   functor Promise|Functor,
 *   mapper SyncOrAsyncMapper
 * ) -> mappedFunctor Promise|Functor
 *
 * map.series(
 *   mapper SyncOrAsyncMapper
 * )(functor Functor) -> mappedFunctor Promise|Functor
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
 * If the functor is an object with a `.map` method, the mapper function signature is defined externally. Serial execution is not guaranteed in this case.
 *
 * If the functor is a generator, the mapper function must be synchronous.
 *
 * If the functor is a promise, it is resolved for its value before further execution for the eager interface only.
 *
 * ```javascript [playground]
 * const asyncSquare = async n => n ** 2
 *
 * map.series(Promise.resolve([1, 2, 3, 4, 5]), asyncSquare).then(console.log)
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
 *   item any,
 *   indexOrKey number|string|any,
 *   functor Functor
 * )=>(mappedItem Promise|any)
 *
 * map.pool(
 *   functor MapPoolFunctor,
 *   concurrency number,
 *   mapper SyncOrAsyncMapper
 * ) -> result Promise|Array
 *
 * map.pool(
 *   concurrency number,
 *   mapper SyncOrAsyncMapper
 * )(functor MapPoolFunctor) -> result Promise|Array
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
 * map.pool(ids, 2, pipe(delayedIdentity, console.log))
 * ```
 *
 * If the functor is a promise, it is resolved for its value before further execution for the eager interface only.
 *
 * ```javascript [playground]
 * const asyncSquare = async n => n ** 2
 *
 * map.pool(Promise.resolve([1, 2, 3, 4, 5]), 5, asyncSquare).then(console.log)
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

module.exports = map
