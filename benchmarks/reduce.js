const timeInLoop = require('../x/timeInLoop')
const { reduce } = require('..')
const R = require('ramda')
const _ = require('lodash')
const _fp = require('lodash/fp')
const curry4 = require('../_internal/curry4')
const curry5 = require('../_internal/curry5')
const __ = require('../_internal/placeholder')
const sha256 = require('../_internal/sha256')

const isPromise = value => value != null && typeof value.then == 'function'

const promiseResolve = Promise.resolve.bind(Promise)

const Async = func => function asyncFunction(...args) {
  return promiseResolve(func(...args))
}

/**
 * @name raceAddNumbers
 *
 * @benchmark
 * rubico.reduce(add, 0)(numbers): 1e+6: 21.505ms
 * ramda.reduce(add, 0)(numbers): 1e+6: 400.881ms
 * lodash.fp.reduce(add, 0)(numbers): 1e+6: 256.675ms
 * lodash.reduce(numbers, add, 0): 1e+6: 26.885ms
 * lodash.reduce(numbers, add, 0) handicap: 1e+6: 26.512ms
 *
 * @note Bo5
 */

{
  const numbers = [1, 2, 3, 4, 5]

  const add = (a, b) => a + b

  const rubicoReducing = reduce(add, 0)

  const ramdaReducing = R.reduce(add, 0)

  const _reduce = _.reduce

  const lodashFPReducing = _fp.reduce(add, 0)

  const lodashReducing = numbers => _reduce(numbers, add, 0)

  const lodashBoostedReducing = () => _reduce(numbers, add, 0)

  // console.log(rubicoReducing(numbers))
  // console.log(ramdaReducing(numbers))
  // console.log(lodashFPReducing(numbers))
  // console.log(lodashReducing(numbers))
  // console.log(lodashBoostedReducing(numbers))

  // timeInLoop('rubico.reduce(add, 0)(numbers)', 1e6, () => rubicoReducing(numbers))

  // timeInLoop('ramda.reduce(add, 0)(numbers)', 1e6, () => ramdaReducing(numbers))

  // timeInLoop('lodash.fp.reduce(add, 0)(numbers)', 1e6, () => lodashFPReducing(numbers))

  // timeInLoop('lodash.reduce(numbers, add, 0)', 1e6, () => lodashReducing(numbers))

  // timeInLoop('lodash.reduce(numbers, add, 0) handicap', 1e6, () => lodashBoostedReducing(numbers))
}

/**
 * @name raceAddNumbersSet
 *
 * @benchmark
 * rubico.reduce(add, 0)(numbers): 1e+6: 90.938ms
 * ramda.reduce(add, 0)(numbers): 1e+6: 560.897ms
 *
 * @note Bo5
 */

{
  const numbers = new Set([1, 2, 3, 4, 5])

  const add = (a, b) => a + b

  const rubicoReducing = reduce(add, 0)

  const ramdaReducing = R.reduce(add, 0)

  const _reduce = _.reduce

  const lodashFPReducing = _fp.reduce(add, 0)

  const lodashReducing = numbers => _reduce(numbers, add, 0)

  const lodashBoostedReducing = () => _reduce(numbers, add, 0)

  // console.log(rubicoReducing(numbers))
  // console.log(ramdaReducing(numbers))

  // timeInLoop('rubico.reduce(add, 0)(numbers)', 1e6, () => rubicoReducing(numbers))

  // timeInLoop('ramda.reduce(add, 0)(numbers)', 1e6, () => ramdaReducing(numbers))
}

const asyncArrayReduce = async function (array, reducer, result, index) {
  const arrayLength = array.length
  while (++index < arrayLength) {
    result = await reducer(result, array[index])
  }
  return result
}

const asyncArrayReduceResultResolver = (
  array, reducer, index,
) => function resolver(result) {
  return asyncArrayReduce(array, reducer, result, index)
}

const arrayReduce1 = function (array, reducer, result) {
  const arrayLength = array.length
  let index = -1
  if (result === undefined) {
    result = array[++index]
  }
  while (++index < arrayLength) {
    result = reducer(result, array[index])
    if (isPromise(result)) {
      return result.then(
        asyncArrayReduceResultResolver(array, reducer, index))
    }
  }
  return result
}

asyncArrayReduce.checkPromises = async function (array, reducer, result, index) {
  const arrayLength = array.length
  while (++index < arrayLength) {
    const intermediate = reducer(result, array[index])
    result = isPromise(intermediate) ? await intermediate : intermediate
  }
  return result
}

asyncArrayReduceResultResolver.checkPromises = (
  array, reducer, index,
) => function resolver(result) {
  return asyncArrayReduce.checkPromises(array, reducer, result, index)
}

const arrayReduce2 = function (array, reducer, result) {
  const arrayLength = array.length
  let index = -1
  if (result === undefined) {
    result = array[++index]
  }
  while (++index < arrayLength) {
    result = reducer(result, array[index])
    if (isPromise(result)) {
      return result.then(
        asyncArrayReduceResultResolver.checkPromises(array, reducer, index))
    }
  }
  return result
}

/**
 * @name arrayReduce
 *
 * @benchmark
 * arrayReduce1: 1e+6: 17.136ms
 * arrayReduce2: 1e+6: 17.105ms
 *
 * -- async
 *  arrayReduce1: 1e+6: 759.37ms
 *  arrayReduce2: 1e+6: 768.136ms
 *
 * @remarks
 * It seems await doesn't really make a difference here when it comes to async
 */

{
  const numbers = [1, 2, 3, 4, 5]

  const add = (a, b) => a + b

  const asyncAdd = async (a, b) => a + b

  // console.log(arrayReduce1(numbers, add, 0))
  // console.log(arrayReduce2(numbers, add, 0))
  // arrayReduce1(numbers, asyncAdd, 0).then(console.log)
  // arrayReduce2(numbers, asyncAdd, 0).then(console.log)

  // timeInLoop('arrayReduce1', 1e6, () => arrayReduce1(numbers, add, 0))

  // timeInLoop('arrayReduce2', 1e6, () => arrayReduce2(numbers, add, 0))

  // timeInLoop.async('arrayReduce1', 1e6, () => arrayReduce1(numbers, asyncAdd, 0))

  // timeInLoop.async('arrayReduce2', 1e6, () => arrayReduce2(numbers, asyncAdd, 0))
}

const asyncIteratorReduce1 = async function (asyncIterator, reducer, result) {
  let iteration = await asyncIterator.next()
  if (iteration.done) {
    return result
  }
  if (result === undefined) {
    result = iteration.value
    iteration = await asyncIterator.next()
  }
  while (!iteration.done) {
    result = await reducer(result, iteration.value)
    iteration = await asyncIterator.next()
  }
  return result
}

/**
 * @name asyncIteratorReduce
 *
 * @benchmark
 * asyncIteratorReduce1: 1e+5: 242.883ms
 */

{
  const add = (a, b) => a + b

  const numbers = async function* () { yield 1; yield 2; yield 3; yield 4; yield 5 }

  // asyncIteratorReduce1(numbers(), add, 0).then(console.log)

  // timeInLoop.async('asyncIteratorReduce1', 1e5, () => asyncIteratorReduce1(numbers(), add, 0))
}

const asyncIteratorReduce = async function (asyncIterator, reducer, result) {
  let iteration = await asyncIterator.next()
  if (iteration.done) {
    return result
  }
  if (result === undefined) {
    result = iteration.value
    iteration = await asyncIterator.next()
  }
  while (!iteration.done) {
    result = await reducer(result, iteration.value)
    iteration = await asyncIterator.next()
  }
  return result
}

const asyncIteratorReduceResultResolver = (
  asyncIterator, reducer,
) => function resolver(result) {
  return asyncIteratorReduce(asyncIterator, reducer, result)
}

const iteratorReduce1 = function (iterator, reducer, result) {
  let iteration = iterator.next()
  if (iteration.done) {
    return result
  }
  if (result === undefined) {
    result = iteration.value
    iteration = iterator.next()
  }
  while (!iteration.done) {
    result = reducer(result, iteration.value)
    if (isPromise(result)) {
      return result.then(
        asyncIteratorReduceResultResolver(iterator, reducer))
    }
    iteration = iterator.next()
  }
  return result
}

/**
 * @name iteratorReduce
 *
 * @benchmark
 * iteratorReduce1: 1e+5: 39.735ms
 *
 * -- async
 * iteratorReduce1: 1e+5: 177.672ms
 */

{
  const add = (a, b) => a + b

  const asyncAdd = async (a, b) => a + b

  const numbers = function* () { yield 1; yield 2; yield 3; yield 4; yield 5 }

  // console.log(iteratorReduce1(numbers(), add, 0))
  // iteratorReduce1(numbers(), asyncAdd, 0).then(console.log)

  // timeInLoop('iteratorReduce1', 1e5, () => iteratorReduce1(numbers(), add, 0))

  // timeInLoop.async('iteratorReduce1', 1e5, () => iteratorReduce1(numbers(), asyncAdd, 0))
}

const iteratorReduce = function (iterator, reducer, result) {
  let iteration = iterator.next()
  if (iteration.done) {
    return result
  }
  if (result === undefined) {
    result = iteration.value
    iteration = iterator.next()
  }
  while (!iteration.done) {
    result = reducer(result, iteration.value)
    if (isPromise(result)) {
      return result.then(
        asyncIteratorReduceResultResolver(iterator, reducer))
    }
    iteration = iterator.next()
  }
  return result
}

const objectValuesIterator = function* (object) {
  for (const key in object) {
    yield object[key]
  }
}

const objectReduce1 = (object, reducer, result) => iteratorReduce(
  objectValuesIterator(object), reducer, result)

const objectValues = Object.values

const objectReduce2 = (object, reducer, result) => arrayReduce1(
  objectValues(object), reducer, result)

const objectKeys = Object.keys

const objectReduce3Async = async function (object, reducer, result, keys, index) {
  const keysLength = keys.length
  while (++index < keysLength) {
    const key = keys[index]
    result = reducer(result, object[key], key, object)
    if (isPromise(result)) {
      result = await result
    }
  }
  return result
}

const objectReduce3 = function (object, reducer, result) {
  const keys = objectKeys(object),
    keysLength = keys.length
  let index = -1
  if (result === undefined) {
    result = object[keys[++index]]
  }
  while (++index < keysLength) {
    const key = keys[index]
    result = reducer(result, object[key], key, object)
    if (isPromise(result)) {
      return result.then(curry5(objectReduce3Async, object, reducer, __, keys, index))
    }
  }
  return result
}

/**
 * @name objectReduce
 *
 * @benchmark
 * // numbers5
 * objectReduce1: 1e+6: 377.995ms
 * objectReduce2: 1e+6: 288.279ms
 * objectReduce3: 1e+6: 121.555ms
 *
 * // numbers10
 * objectReduce1: 1e+6: 634.794ms
 * objectReduce2: 1e+6: 422.544ms
 * objectReduce3: 1e+6: 238.916ms
 *
 * // numericObject10
 * objectReduce1: 1e+5: 121.482ms
 * objectReduce2: 1e+5: 45.423ms
 * objectReduce3: 1e+5: 57.031ms
 *
 * // hashObject10
 * objectReduce1: 1e+5: 83.197ms
 * objectReduce2: 1e+5: 58.986ms
 * objectReduce3: 1e+5: 36.719ms
 *
 * // hashObject100
 * objectReduce1: 1e+4: 115.869ms
 * objectReduce2: 1e+4: 200.251ms
 * objectReduce3: 1e+4: 62.409ms
 *
 * // numericObject50
 * objectReduce1: 1e+5: 451.518ms
 * objectReduce2: 1e+5: 86.637ms
 * objectReduce3: 1e+5: 170.327ms
 *
 * // numericObject100
 * objectReduce1: 1e+4: 100.247ms
 * objectReduce2: 1e+4: 26.077ms
 * objectReduce3: 1e+4: 42.457ms
 *
 * // numericObject1000
 * objectReduce1: 1e+4: 800.712ms
 * objectReduce2: 1e+4: 123.687ms
 * objectReduce3: 1e+4: 305.151ms
 *
 * // numericObject1e4
 * objectReduce1: 1e+3: 819.551ms
 * objectReduce2: 1e+3: 115.656ms
 * objectReduce3: 1e+3: 303.498ms
 *
 * // numericObject1e5
 * objectReduce1: 1e+2: 1.699s
 * objectReduce2: 1e+2: 179.696ms
 * objectReduce3: 1e+2: 1.035s
 *
 * // numericObject1e6
 * objectReduce1: 1e+0: 256.155ms
 * objectReduce2: 1e+0: 22.112ms
 * objectReduce3: 1e+0: 180.417ms
 *
 * // empty
 * objectReduce1 - empty: 1e+6: 74.931ms
 * objectReduce2: 1e+6: 25.596ms
 * objectReduce3: 1e+6: 24.173ms
 *
 * // async numbers5
 * objectReduce1: 1e+5: 194.493ms
 * objectReduce2: 1e+5: 123.184ms
 * objectReduce3: 1e+5: 179.193ms
 *
 * @remarks
 * Object.keys + arrayReduce is faster than newer syntax with iterators
 *
 * For regular objects (not numeric ones) we progress by 3
 */

{
  const numbers5 = { a: 1, b: 2, c: 3, d: 4, e: 5 }

  const numbers10 = {
     a: 1, b: 2, c: 3, d: 4, e: 5,
     f: 6, g: 7, h: 8, i: 9, j: 10,
  }

  const HashObject = function (size) {
    const result = {}
    let index = -1
    while (++index < size) {
      result[sha256(String(index))] = index
    }
    return result
  }

  const NumericObject = function (size) {
    const result = {}
    let index = -1
    while (++index < size) {
      result[`${index}`] = index
    }
    return result
  }

  const empty = {}

  const add = (a, b) => a + b

  const asyncAdd = async (a, b) => a + b

  // console.log(objectReduce1(numbers5, add, 0))
  // objectReduce1(numbers5, asyncAdd, 0).then(console.log)
  // console.log(objectReduce2(numbers5, add, 0))
  // objectReduce2(numbers5, asyncAdd, 0).then(console.log)
  // console.log(objectReduce3(numbers5, add, 0))
  // objectReduce3(numbers5, asyncAdd, 0).then(console.log)
  // const hashObject100 = HashObject(100)
  // console.log(objectReduce1(hashObject100, add, 0))
  // objectReduce1(hashObject100, asyncAdd, 0).then(console.log)
  // console.log(objectReduce2(hashObject100, add, 0))
  // objectReduce2(hashObject100, asyncAdd, 0).then(console.log)
  // console.log(objectReduce3(hashObject100, add, 0))
  // objectReduce3(hashObject100, asyncAdd, 0).then(console.log)

  // numbers5
  // timeInLoop('objectReduce1', 1e6, () => objectReduce1(numbers5, add, 0))
  // timeInLoop('objectReduce2', 1e6, () => objectReduce2(numbers5, add, 0))
  // timeInLoop('objectReduce3', 1e6, () => objectReduce3(numbers5, add, 0))

  // numbers10
  // timeInLoop('objectReduce1', 1e6, () => objectReduce1(numbers10, add, 0))
  // timeInLoop('objectReduce2', 1e6, () => objectReduce2(numbers10, add, 0))
  // timeInLoop('objectReduce3', 1e6, () => objectReduce3(numbers10, add, 0))

  // hashObject10
  // const hashObject10 = HashObject(10)
  // timeInLoop('objectReduce1', 1e5, () => objectReduce1(hashObject10, add, 0))
  // timeInLoop('objectReduce2', 1e5, () => objectReduce2(hashObject10, add, 0))
  // timeInLoop('objectReduce3', 1e5, () => objectReduce3(hashObject10, add, 0))

  // hashObject100
  // const hashObject100 = HashObject(100)
  // timeInLoop('objectReduce1', 1e4, () => objectReduce1(hashObject100, add, 0))
  // timeInLoop('objectReduce2', 1e4, () => objectReduce2(hashObject100, add, 0))
  // timeInLoop('objectReduce3', 1e4, () => objectReduce3(hashObject100, add, 0))

  // numericObject10
  // const numericObject10 = NumericObject(10)
  // timeInLoop('objectReduce1', 1e5, () => objectReduce1(numericObject10, add, 0))
  // timeInLoop('objectReduce2', 1e5, () => objectReduce2(numericObject10, add, 0))
  // timeInLoop('objectReduce3', 1e5, () => objectReduce3(numericObject10, add, 0))

  // numericObject50
  // const numericObject50 = NumericObject(50)
  // timeInLoop('objectReduce1', 1e5, () => objectReduce1(numericObject50, add, 0))
  // timeInLoop('objectReduce2', 1e5, () => objectReduce2(numericObject50, add, 0))
  // timeInLoop('objectReduce3', 1e5, () => objectReduce3(numericObject50, add, 0))

  // numericObject100
  // const numericObject100 = NumericObject(100)
  // timeInLoop('objectReduce1', 1e4, () => objectReduce1(numericObject100, add, 0))
  // timeInLoop('objectReduce2', 1e4, () => objectReduce2(numericObject100, add, 0))
  // timeInLoop('objectReduce3', 1e4, () => objectReduce3(numericObject100, add, 0))

  // numericObject1000
  // const numericObject1000 = NumericObject(1000)
  // timeInLoop('objectReduce1', 1e4, () => objectReduce1(numericObject1000, add, 0))
  // timeInLoop('objectReduce2', 1e4, () => objectReduce2(numericObject1000, add, 0))
  // timeInLoop('objectReduce3', 1e4, () => objectReduce3(numericObject1000, add, 0))

  // numericObject1e4
  // const numericObject1e4 = NumericObject(1e4)
  // timeInLoop('objectReduce1', 1e3, () => objectReduce1(numericObject1e4, add, 0))
  // timeInLoop('objectReduce2', 1e3, () => objectReduce2(numericObject1e4, add, 0))
  // timeInLoop('objectReduce3', 1e3, () => objectReduce3(numericObject1e4, add, 0))

  // numericObject1e5
  // const numericObject1e5 = NumericObject(1e5)
  // timeInLoop('objectReduce1', 1e2, () => objectReduce1(numericObject1e5, add, 0))
  // timeInLoop('objectReduce2', 1e2, () => objectReduce2(numericObject1e5, add, 0))
  // timeInLoop('objectReduce3', 1e2, () => objectReduce3(numericObject1e5, add, 0))

  // numericObject1e6
  // const numericObject1e6 = NumericObject(1e6)
  // timeInLoop('objectReduce1', 1, () => objectReduce1(numericObject1e6, add, 0))
  // timeInLoop('objectReduce2', 1, () => objectReduce2(numericObject1e6, add, 0))
  // timeInLoop('objectReduce3', 1, () => objectReduce3(numericObject1e6, add, 0))

  // empty
  // timeInLoop('objectReduce1', 1e6, () => objectReduce1(empty, add, 0))
  // timeInLoop('objectReduce2', 1e6, () => objectReduce2(empty, add, 0))
  // timeInLoop('objectReduce3', 1e6, () => objectReduce3(empty, add, 0))

  // async numbers
  // timeInLoop.async('objectReduce1', 1e5, () => objectReduce1(numbers, asyncAdd, 0))
  // timeInLoop.async('objectReduce2', 1e5, () => objectReduce2(numbers, asyncAdd, 0))
  // timeInLoop.async('objectReduce3', 1e5, () => objectReduce3(numbers, asyncAdd, 0))
}

// maybe dust this off for concurrent reduce
const mapReduceForEach = function (map, reducer, result) {
}

const mapReduceEntriesAsync = async function (
  map, reducer, result, mapEntriesIter,
) {
  for (const [key, value] of mapEntriesIter) {
    result = reducer(result, value, key, map)
    if (isPromise(result)) {
      result = await result
    }
  }
  return result
}

const mapReduceEntries = function (map, reducer, result) {
  const mapEntriesIter = map.entries()
  if (result === undefined) {
    const firstIteration = mapEntriesIter.next()
    if (firstIteration.done) {
      return result
    }
    result = firstIteration.value[1]
  }
  for (const [key, value] of mapEntriesIter) {
    result = reducer(result, value, key, map)
    if (isPromise(result)) {
      return result.then(curry4(
        mapReduceEntriesAsync, map, reducer, __, mapEntriesIter))
    }
  }
  return result
}

const mapReduceEntriesArrayAsync = async function (
  map, reducer, result, mapEntriesArray, index,
) {
  const mapEntriesArrayLength = mapEntriesArray.length
  while (++index < mapEntriesArrayLength) {
    const [key, value] = mapEntriesArray[index]
    result = reducer(result, value, key, map)
    if (isPromise(result)) {
      result = await result
    }
  }
  return result
}

const mapReduceEntriesArray = function (map, reducer, result) {
  const mapEntriesArray = [...map.entries()],
    mapEntriesArrayLength = mapEntriesArray.length
  let index = -1
  if (result === undefined) {
    if (mapEntriesArrayLength == 0) {
      return result
    }
    result = mapEntriesArray[++index][1]
  }
  while (++index < mapEntriesArrayLength) {
    const [key, value] = mapEntriesArray[index]
    result = reducer(result, value, key, map)
    if (isPromise(result)) {
      return result.then(curry5(
        mapReduceEntriesArrayAsync, map, reducer, __, mapEntriesArray, index))
    }
  }
  return result
}

/**
 * @name mapReduce
 *
 * @benchmark
 * # stringNumberMap5
 * mapReduceEntries: 1e+6: 99.731ms
 * mapReduceEntriesArray: 1e+6: 98.929ms
 *
 * # stringNumberMap10
 * mapReduceEntries: 1e+6: 167.5ms
 * mapReduceEntriesArray: 1e+6: 165.228ms
 *
 * # stringNumberMap50
 * mapReduceEntries: 1e+5: 90.172ms
 * mapReduceEntriesArray: 1e+5: 91.254ms
 *
 * # stringObjectMap5
 * mapReduceEntries: 1e+6: 98.921ms
 * mapReduceEntriesArray: 1e+6: 482.66ms
 *
 * # stringObjectMap10
 * mapReduceEntries: 1e+5: 34.198ms
 * mapReduceEntriesArray: 1e+5: 96.555ms
 *
 * # stringObjectMap50
 * mapReduceEntries: 1e+5: 93.92ms
 * mapReduceEntriesArray: 1e+5: 351.628ms
 */

{
  const add = (a, b) => a + b
  const addValue = (a, b) => a + b.value

  const StringNumberMap = function (size) {
    const result = new Map()
    let index = -1
    while (++index < size) {
      result.set(sha256(String(index)), index)
    }
    return result
  }

  const StringObjectMap = function (size) {
    const result = new Map()
    let index = -1
    while (++index < size) {
      const hash = sha256(String(index))
      result.set(hash, { value: index })
    }
    return result
  }

  const stringNumberMap5 = StringNumberMap(5)
  const stringNumberMap10 = StringNumberMap(10)
  const stringNumberMap50 = StringNumberMap(50)
  const stringObjectMap5 = StringObjectMap(5)
  const stringObjectMap10 = StringObjectMap(10)
  const stringObjectMap50 = StringObjectMap(50)
  // console.log(mapReduceEntries(stringNumberMap5, add, 0))
  // console.log(mapReduceEntries(stringNumberMap5, add))
  // console.log(mapReduceEntriesArray(stringNumberMap5, add, 0))
  // console.log(mapReduceEntriesArray(stringNumberMap5, add))
  // console.log(mapReduceEntries(stringObjectMap5, addValue, 0))

  // timeInLoop('mapReduceEntries', 1e6, () => mapReduceEntries(stringNumberMap5, add, 0))
  // timeInLoop('mapReduceEntriesArray', 1e6, () => mapReduceEntries(stringNumberMap5, add, 0))
  // timeInLoop('mapReduceEntries', 1e6, () => mapReduceEntries(stringNumberMap10, add, 0))
  // timeInLoop('mapReduceEntriesArray', 1e6, () => mapReduceEntries(stringNumberMap10, add, 0))
  // timeInLoop('mapReduceEntries', 1e5, () => mapReduceEntries(stringNumberMap50, add, 0))
  // timeInLoop('mapReduceEntriesArray', 1e5, () => mapReduceEntries(stringNumberMap50, add, 0))

  // timeInLoop('mapReduceEntries', 1e6, () => mapReduceEntries(stringObjectMap5, addValue, 0))
  // timeInLoop('mapReduceEntriesArray', 1e6, () => mapReduceEntriesArray(stringObjectMap5, addValue, 0))
  // timeInLoop('mapReduceEntries', 1e5, () => mapReduceEntries(stringObjectMap10, addValue, 0))
  // timeInLoop('mapReduceEntriesArray', 1e5, () => mapReduceEntriesArray(stringObjectMap10, addValue, 0))
  // timeInLoop('mapReduceEntries', 1e5, () => mapReduceEntries(stringObjectMap50, addValue, 0))
  // timeInLoop('mapReduceEntriesArray', 1e5, () => mapReduceEntriesArray(stringObjectMap50, addValue, 0))
}

/**
 * @name combinedReducer
 *
 * @benchmark
 * combinedReducingFunction1: 1e+6: 420.432ms
 * combinedReducingFunction2: 1e+6: 418.762ms
 */

{
  const reducers = [
    (state, action) => action.type == 'A' ? { ...state, A: true } : state,
    (state, action) => action.type == 'B' ? { ...state, B: true } : state,
    (state, action) => action.type == 'C' ? { ...state, C: true } : state,
  ]
  const combinedReducingFunction1 = reduce(
    (reducingFunc, reducer) => reducingFunc(reducer),
    () => reduce(result => result, () => ({})),
  )(reducers)

  const combinedReducingFunction2 = reduce(
    result => result, () => ({}),
  )(...reducers)

  const actions = [{ type: 'A' }, { type: 'B' }, { type: 'C' }]

  // console.log(combinedReducingFunction1(actions))
  // console.log(combinedReducingFunction2(actions))

  // timeInLoop('combinedReducingFunction1', 1e6, () => combinedReducingFunction1(actions))

  // timeInLoop('combinedReducingFunction2', 1e6, () => combinedReducingFunction2(actions))
}
