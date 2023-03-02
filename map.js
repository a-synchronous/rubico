const MappingIterator = require('./_internal/MappingIterator')
const MappingAsyncIterator = require('./_internal/MappingAsyncIterator')
const __ = require('./_internal/placeholder')
const curry2 = require('./_internal/curry2')
const isArray = require('./_internal/isArray')
const isObject = require('./_internal/isObject')
const isGeneratorFunction = require('./_internal/isGeneratorFunction')
const isAsyncGeneratorFunction = require('./_internal/isAsyncGeneratorFunction')
const arrayMap = require('./_internal/arrayMap')
const generatorFunctionMap = require('./_internal/generatorFunctionMap')
const asyncGeneratorFunctionMap = require('./_internal/asyncGeneratorFunctionMap')
const reducerMap = require('./_internal/reducerMap')
const stringMap = require('./_internal/stringMap')
const setMap = require('./_internal/setMap')
const mapMap = require('./_internal/mapMap')
const objectMap = require('./_internal/objectMap')
const arrayMapSeries = require('./_internal/arrayMapSeries')
const arrayMapPool = require('./_internal/arrayMapPool')
const arrayMapWithIndex = require('./_internal/arrayMapWithIndex')
const objectMapOwn = require('./_internal/objectMapOwn')
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
 *
 * _map(
 *   generatorFunction ...args=>Generator,
 *   syncMapper (value any)=>any,
 * ) -> mappingGeneratorFunction ...args=>Generator
 *
 * _map(
 *   asyncGeneratorFunction ...args=>AsyncGenerator,
 *   mapper (value any)=>Promise|any
 * ) -> mappingAsyncGeneratorFunction ...args=>AsyncGenerator
 *
 * _map(
 *   originalReducer Reducer,
 *   mapper (value any)=>Promise|any,
 * ) -> mappingReducer Reducer
 * ```
 */

const _map = function (value, mapper) {
  if (isArray(value)) {
    return arrayMap(value, mapper)
  }
  if (typeof value == 'function') {
    if (isGeneratorFunction(value)) {
      return generatorFunctionMap(value, mapper)
    }
    if (isAsyncGeneratorFunction(value)) {
      return asyncGeneratorFunctionMap(value, mapper)
    }
    return reducerMap(value, mapper)
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
 * arrayMapperFunc (value any, index number, array Array)=>Promise|any
 *
 * map(arrayMapperFunc)(value Array) -> result Promise|Array
 * map(value Array, arrayMapperFunc) -> result Promise|Array
 *
 * objectMapperFunc (value any, key string, object Object)=>Promise|any
 *
 * map(objectMapperFunc)(value Object) -> result Promise|Array
 * map(value Object, objectMapperFunc) -> result Promise|Array
 *
 * setMapperFunc (value any, value, set Set)=>Promise|any
 *
 * map(setMapperFunc)(value Set) -> result Promise|Set
 * map(value Set, setMapperFunc) -> result Promise|Set
 *
 * mapMapperFunc (value any, key any, originalMap Map)=>Promise|any
 *
 * map(mapMapperFunc)(value Map) -> result Promise|Map
 * map(value Map, mapMapperFunc) -> result Promise|Map
 *
 * iteratorMapperFunc (value any)=>any
 *
 * map(iteratorMapperFunc)(value Iterator) -> result Iterator
 * map(value Iterator, iteratorMapperFunc) -> result Iterator
 *
 * asyncIteratorMapperFunc (value any)=>Promise|any
 *
 * map(asyncIteratorMapperFunc)(value AsyncIterator) -> result AsyncIterator
 * map(value AsyncIterator, asyncIteratorMapperFunc) -> result AsyncIterator
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
 *  * Special types with a `.map` method `{ map: function }`
 *
 * With arrays (type `Array`), `map` applies the mapper function to each item of the array, returning the transformed results in a new array ordered the same as the original array.
 *
 * ```javascript [playground]
 * const square = number => number ** 2
 *
 * const array = [1, 2, 3, 4, 5]
 *
 * console.log(map(array, square)) // [1, 4, 9, 16, 25]
 * console.log(map(square)(array)) // [1, 4, 9, 16, 25]
 * ```
 *
 * With objects (type `Object`), `map` applies the mapper function to each value of the object, returning the transformed results as values in a new object ordered by the keys of the original object
 *
 * ```javascript [playground]
 * const square = number => number ** 2
 *
 * const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 }
 *
 * console.log(map(square)(obj)) // { a: 1, b: 4, c: 9, d: 16, e: 25 }
 * console.log(map(obj, square)) // { a: 1, b: 4, c: 9, d: 16, e: 25 }
 * ```
 *
 * With sets (type `Set`), `map` applies the mapper function to each value of the set, returning the transformed results unordered in a new set.
 *
 * ```javascript [playground]
 * const square = number => number ** 2
 *
 * const set = new Set([1, 2, 3, 4, 5])
 *
 * console.log(map(set, square)) // [1, 4, 9, 16, 25]
 * console.log(map(square)(set)) // [1, 4, 9, 16, 25]
 * ```
 *
 * With maps (type `Map`), `map` applies the mapper function to each value of the map, returning the results at the same keys in a new map. The entries of the resulting map are in the same order as those of the original map
 *
 * ```javascript [playground]
 * const square = number => number ** 2
 *
 * const m = new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5]])
 *
 * console.log(map(square)(m)) // Map { 'a' => 1, 'b' => 4, 'c' => 9, 'd' => 16, 'e' => 25 }
 * console.log(map(m, square)) // Map { 'a' => 1, 'b' => 4, 'c' => 9, 'd' => 16, 'e' => 25 }
 * ```
 *
 * With iterators (type `Iterator` or `Generator`), `map` applies the mapper function lazily to each value of the iterator, creating a new iterator with transformed iterations.
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
 * For any special type with a `.map` method such as the `Maybe` monad, `map` calls the `.map` method with the mapper function directly
 *
 * ```javascript [playground]
 * const square = number => number ** 2
 *
 * const Maybe = value => ({
 *   map(mapperFunc) {
 *     return value == null ? Maybe(value) : Maybe(mapperFunc(value))
 *   },
 *   chain(flatMapperFunc) {
 *     return value == null ? value : flatMapperFunc(value)
 *   },
 * })
 *
 * Maybe(5).map(square).chain(console.log) // 25
 *
 * Maybe(null).map(square).chain(console.log)
 * ```
 *
 * @execution concurrent
 *
 * @TODO streamMap
 */

const map = (...args) => {
  const mapper = args.pop()
  if (args.length > 0) {
    return _map(args[0], mapper)
  }
  return curry2(_map, __, mapper)
}

/**
 * @name map.entries
 *
 * @synopsis
 * ```coffeescript [specscript]
 * map.entries(
 *   mapper ([key any, value any])=>Promise|[any, any],
 * )(value Map|Object) -> Promise|Map|Object
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
 * @since v1.7.0
 */
map.entries = function mapEntries(mapper) {
  return function mappingEntries(value) {
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
}

/**
 * @name map.series
 *
 * @synopsis
 * ```coffeescript [specscript]
 * map.series(
 *   mapperFunc (value any)=>Promise|any,
 * )(array Array) -> Promise|Array
 * ```
 *
 * @description
 * `map` with serial execution.
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
 * map.series(delayedLog)([1, 2, 3, 4, 5])
 * ```
 *
 * @execution series
 */
map.series = mapper => function mappingInSeries(value) {
  if (isArray(value)) {
    return arrayMapSeries(value, mapper)
  }
  throw new TypeError(`${value} is not an Array`)
}

/**
 * @name map.pool
 *
 * @synopsis
 * ```coffeescript [specscript]
 * map.pool(
 *   maxConcurrency number,
 *   mapper (value any)=>Promise|any,
 * )(array Array) -> result Promise|Array
 * ```
 *
 * @description
 * `map` that specifies the maximum concurrency (number of ongoing promises at any time) of the execution. Only works for arrays.
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
 * @TODO objectMapPool
 *
 * @execution concurrent
 */
map.pool = (concurrencyLimit, mapper) => function concurrentPoolMapping(value) {
  if (isArray(value)) {
    return arrayMapPool(value, mapper, concurrencyLimit)
  }
  throw new TypeError(`${value} is not an Array`)
}

/**
 * @name map.withIndex
 *
 * @synopsis
 * ```coffeescript [specscript]
 * map.withIndex(
 *   indexedMapperFunc (item any, index numberl, array Array)=>Promise|any,
 * )(array Array) -> result Promise|Array
 * ```
 *
 * @description
 * `map` with an indexed mapper.
 *
 * ```javascript [playground]
 * const range = length =>
 *   map.withIndex((_, index) => index + 1)(Array(length))
 *
 * console.log(range(5)) // [1, 2, 3, 4, 5]
 * ```
 *
 * @execution concurrent
 *
 * @related
 * map, filter.withIndex
 *
 * @DEPRECATED
 */
map.withIndex = mapper => function mappingWithIndex(value) {
  if (isArray(value)) {
    return arrayMapWithIndex(value, mapper)
  }
  throw new TypeError(`${value} is not an Array`)
}

/**
 * @name map.own
 *
 * @synopsis
 * ```coffeescript [specscript]
 * map.own(
 *   mapperFunc (item any)=>Promise|any,
 * )(object Object) -> result Promise|Object
 * ```
 *
 * @description
 * Applies a mapper function concurrently to an object's own values, returning an object of results. Mapper may be asynchronous.
 * Guards mapping by validating that each property is the object's own and not inherited from the prototype chain.
 *
 * ```javascript [playground]
 * const Person = function (name) {
 *   this.name = name
 * }
 *
 * Person.prototype.greet = function () {}
 *
 * const david = new Person('david')
 * david.a = 1
 * david.b = 2
 * david.c = 3
 *
 * const square = number => number ** 2
 * console.log(
 *   map.own(square)(david)
 * ) // { name: NaN, a: 1, b: 4, c: 9 }
 * ```
 *
 * @DEPRECATED
 */
map.own = mapper => function mappingOwnProperties(value) {
  if (isObject(value) && !isArray(value)) {
    return objectMapOwn(value, mapper)
  }
  throw new TypeError(`${value} is not an Object`)
}

module.exports = map
