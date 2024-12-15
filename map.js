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

const _map = function (value, mapper) {
  if (isArray(value)) {
    return arrayMap(value, mapper)
  }
  if (value == null) {
    return value
  }

  if (typeof value.then == 'function') {
    return value.then(mapper)
  }
  if (typeof value.map == 'function') {
    return value.map(mapper)
  }
  if (typeof value == 'string' || value.constructor == String) {
    return stringMap(value, mapper)
  }
  if (value.constructor == Set) {
    return setMap(value, mapper)
  }
  if (value.constructor == Map) {
    return mapMap(value, mapper)
  }
  if (typeof value[symbolIterator] == 'function') {
    return MappingIterator(value[symbolIterator](), mapper)
  }
  if (typeof value[symbolAsyncIterator] == 'function') {
    return MappingAsyncIterator(value[symbolAsyncIterator](), mapper)
  }
  if (value.constructor == Object) {
    return objectMap(value, mapper)
  }
  return mapper(value)
}

/**
 * @name map
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Mappable = Array|Object|Set|Map|Iterator|AsyncIterator
 *
 * type Mapper = (
 *   value any,
 *   indexOrKey number|string|any,
 *   collection Mappable
 * )=>(resultItem Promise|any)
 *
 * map(collection Promise|Mappable, f Mapper) -> result Promise|Mappable
 * map(f Mapper)(collection Mappable) -> result Promise|Mappable
 * ```
 *
 * @description
 * Applies a synchronous or asynchronous mapper function concurrently to each item of a collection, returning the results in a new collection of the same type. If order is implied by the collection, it is maintained in the result. `map` accepts the following collections:
 *
 *  * `Array`
 *  * `Object`
 *  * `Set`
 *  * `Map`
 *  * `Iterator`/`Generator`
 *  * `AsyncIterator`/`AsyncGenerator`
 *
 * With arrays (type `Array`), `map` applies the mapper function to each item of the array, returning the transformed results in a new array ordered the same as the original array.
 *
 * ```javascript [playground]
 * const square = number => number ** 2
 *
 * const array = [1, 2, 3, 4, 5]
 *
 * console.log(
 *   map(array, square)
 * ) // [1, 4, 9, 16, 25]
 *
 * console.log(
 *   map(square)(array)
 * ) // [1, 4, 9, 16, 25]
 * ```
 *
 * With objects (type `Object`), `map` applies the mapper function to each value of the object, returning the transformed results as values in a new object ordered by the keys of the original object
 *
 * ```javascript [playground]
 * const square = number => number ** 2
 *
 * const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 }
 *
 * console.log(
 *   map(square)(obj)
 * ) // { a: 1, b: 4, c: 9, d: 16, e: 25 }
 *
 * console.log(
 *   map(obj, square)
 * ) // { a: 1, b: 4, c: 9, d: 16, e: 25 }
 * ```
 *
 * With sets (type `Set`), `map` applies the mapper function to each value of the set, returning the transformed results unordered in a new set.
 *
 * ```javascript [playground]
 * const square = number => number ** 2
 *
 * const set = new Set([1, 2, 3, 4, 5])
 *
 * console.log(
 *   map(set, square)
 * ) // [1, 4, 9, 16, 25]
 *
 * console.log(
 *   map(square)(set)
 * ) // [1, 4, 9, 16, 25]
 * ```
 *
 * With maps (type `Map`), `map` applies the mapper function to each value of the map, returning the results at the same keys in a new map. The entries of the resulting map are in the same order as those of the original map
 *
 * ```javascript [playground]
 * const square = number => number ** 2
 *
 * const m = new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]])
 *
 * console.log(
 *   map(square)(m)
 * ) // Map { 'a' => 1, 'b' => 4, 'c' => 9, 'd' => 16, 'e' => 25 }
 *
 * console.log(
 *   map(m, square)
 * ) // Map { 'a' => 1, 'b' => 4, 'c' => 9, 'd' => 16, 'e' => 25 }
 * ```
 *
 * With iterators (type `Iterator`) or generators (type `Generator`), `map` applies the mapper function lazily to each value of the iterator/generator, creating a new iterator with transformed iterations.
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
 * const ABCGenerator2 = map(capitalize)(abcGeneratorFunc())
 *
 * console.log([...abcGenerator]) // ['a', 'b', 'c']
 *
 * console.log([...ABCGenerator]) // ['A', 'B', 'C']
 *
 * console.log([...ABCGenerator2]) // ['A', 'B', 'C']
 * ```
 *
 * With asyncIterators (type `AsyncIterator`, or `AsyncGenerator`), `map` applies the mapper function lazily to each value of the asyncIterator, creating a new asyncIterator with transformed iterations
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
 * const ABCGenerator2 = map(capitalize)(abcAsyncGeneratorFunc())
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
 *
 *   for await (const letter of ABCGenerator2) {
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

// _mapEntries(value Object|Map, mapper function) -> Object|Map
const _mapEntries = (value, mapper) => {
  if (value == null) {
    throw new TypeError('value is not an Object or Map')
  }
  if (value.constructor == Object) {
    return objectMapEntries(value, mapper)
  }
  if (value.constructor == Map) {
    return mapMapEntries(value, mapper)
  }
  throw new TypeError('value is not an Object or Map')
}

/**
 * @name map.entries
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type EntriesMappable = Object|Map
 *
 * type Mapper = (
 *   value any,
 *   key string|any,
 *   collection EntriesMappable
 * )=>(resultItem Promise|any)
 *
 * map.entries(value Promise|EntriesMappable, mapper Mapper)
 *   -> Promise|EntriesMappable
 *
 * map.entries(mapper Mapper)(value EntriesMappable)
 *   -> Promise|EntriesMappable
 * ```
 *
 * @description
 * `map` over the entries rather than the values of a collection. Accepts collections of type `Map` or `Object`.
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
 * type Mappable = Array|Object|Set|Map
 *
 * type Mapper = (
 *   value any,
 *   indexOrKey number|string|any,
 *   collection Mappable
 * )=>(mappedItem Promise|any)
 *
 * _mapSeries(collection Mappable, f Mapper) -> result Promise|Mappable
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
 * type Mappable = Array|Object|Set|Map
 *
 * type Mapper = (
 *   value any,
 *   indexOrKey number|string|any,
 *   collection Mappable
 * )=>(mappedItem Promise|any)
 *
 * map.series(collection Promise|Mappable, f Mapper) -> result Mappable
 * map.series(f Mapper)(collection Mappable) -> result Mappable
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
 * type Mappable = Array|Object|Set|Map
 *
 * _mapPool(collection Mappable, concurrency number, f function) -> result Promise|Mappable
 * ```
 */
const _mapPool = function (collection, concurrency, f) {
  if (isArray(collection)) {
    return arrayMapPool(collection, concurrency, f)
  }
  if (collection == null) {
    throw new TypeError(`invalid collection ${collection}`)
  }
  if (typeof collection == 'string' || collection.constructor == String) {
    return stringMapPool(collection, concurrency, f)
  }
  if (collection.constructor == Set) {
    return setMapPool(collection, concurrency, f)
  }
  if (collection.constructor == Map) {
    return mapMapPool(collection, concurrency, f)
  }
  if (collection.constructor == Object) {
    return objectMapPool(collection, concurrency, f)
  }
  throw new TypeError(`invalid collection ${collection}`)
}

/**
 * @name map.pool
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Mappable = Array|Object|Set|Map
 *
 * map.pool(
 *   concurrency number,
 *   mapper (value any)=>Promise|any,
 * )(collection Mappable) -> result Promise|Array
 *
 * map.pool(
 *   collection Mappable,
 *   concurrency number,
 *   mapper (value any)=>Promise|any,
 * ) -> result Promise|Array
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
