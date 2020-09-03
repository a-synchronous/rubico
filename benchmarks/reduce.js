const timeInLoop = require('../x/timeInLoop')
const { reduce } = require('..')
const R = require('ramda')
const _ = require('lodash')
const _fp = require('lodash/fp')

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

/**
 * @name objectReduce
 *
 * @benchmark
 * // numbers
 * objectReduce1: 1e+6: 377.995ms
 * objectReduce2: 1e+6: 288.279ms
 *
 * // numericObject100
 * objectReduce1: 1e+4: 100.247ms
 * objectReduce2: 1e+4: 26.077ms
 *
 * // numericObject1000
 * objectReduce1: 1e+4: 800.712ms
 * objectReduce2: 1e+4: 123.687ms
 *
 * // numericObject1e4
 * objectReduce1: 1e+3: 819.551ms
 * objectReduce2: 1e+3: 115.656ms
 *
 * // numericObject1e5
 * objectReduce1: 1e+2: 1.699s
 * objectReduce2: 1e+2: 183.447ms
 *
 * // numericObject1e6
 * objectReduce1: 1e+0: 256.155ms
 * objectReduce2: 1e+0: 22.112ms
 *
 * // empty
 * objectReduce1 - empty: 1e+6: 74.931ms
 * objectReduce2: 1e+6: 25.596ms
 *
 * // async numbers
 * objectReduce1: 1e+5: 194.493ms
 * objectReduce2: 1e+5: 123.184ms
 *
 * @remarks
 * Object.keys + arrayReduce is faster than newer syntax with iterators
 */

{
  const numbers = { a: 1, b: 2, c: 3, d: 4, e: 5 }

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

  // console.log(objectReduce1(numbers, add, 0))
  // objectReduce1(numbers, asyncAdd, 0).then(console.log)
  // console.log(objectReduce2(numbers, add, 0))
  // objectReduce2(numbers, asyncAdd, 0).then(console.log)

  // numbers
  // timeInLoop('objectReduce1', 1e6, () => objectReduce1(numbers, add, 0))
  // timeInLoop('objectReduce2', 1e6, () => objectReduce2(numbers, add, 0))

  // numericObject100
  // const numericObject100 = NumericObject(100)
  // timeInLoop('objectReduce1', 1e4, () => objectReduce1(numericObject100, add, 0))
  // timeInLoop('objectReduce2', 1e4, () => objectReduce2(numericObject100, add, 0))

  // numericObject1000
  // const numericObject1000 = NumericObject(1000)
  // timeInLoop('objectReduce1', 1e4, () => objectReduce1(numericObject1000, add, 0))
  // timeInLoop('objectReduce2', 1e4, () => objectReduce2(numericObject1000, add, 0))

  // numericObject1e4
  // const numericObject1e4 = NumericObject(1e4)
  // timeInLoop('objectReduce1', 1e3, () => objectReduce1(numericObject1e4, add, 0))
  // timeInLoop('objectReduce2', 1e3, () => objectReduce2(numericObject1e4, add, 0))

  // numericObject1e5
  // const numericObject1e5 = NumericObject(1e5)
  // timeInLoop('objectReduce1', 1e2, () => objectReduce1(numericObject1e5, add, 0))
  // timeInLoop('objectReduce2', 1e2, () => objectReduce2(numericObject1e5, add, 0))

  // numericObject1e6
  // const numericObject1e6 = NumericObject(1e6)
  // timeInLoop('objectReduce1', 1, () => objectReduce1(numericObject1e6, add, 0))
  // timeInLoop('objectReduce2', 1, () => objectReduce2(numericObject1e6, add, 0))

  // empty
  // timeInLoop('objectReduce1', 1e6, () => objectReduce1(empty, add, 0))
  // timeInLoop('objectReduce2', 1e6, () => objectReduce2(empty, add, 0))

  // async numbers
  // timeInLoop.async('objectReduce1', 1e5, () => objectReduce1(numbers, asyncAdd, 0))
  // timeInLoop.async('objectReduce2', 1e5, () => objectReduce2(numbers, asyncAdd, 0))
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
