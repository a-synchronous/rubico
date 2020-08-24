const timeInLoop = require('../x/timeInLoop')
const R = require('ramda')
const _ = require('lodash')

const symbolIterator = Symbol.iterator

const symbolAsyncIterator = Symbol.asyncIterator

const promiseAll = Promise.all.bind(Promise)

const isPromise = value => value != null && typeof value.then == 'function'

const asyncIteratorToArray = async function (asyncIterator) {
  const result = []
  for await (const item of asyncIterator) {
    result[result.length] = item
  }
  return result
}

const asyncArrayReduce = async function (array, reducer, initialValue) {
  let result = initialValue
  for (const item of array) {
    result = await reducer(result, item)
  }
  return result
}

/**
 * @name arrayMap
 *
 * @synopsis
 * any -> A, any -> B
 *
 * arrayMap(array Array<A>, mapper A=>Promise|B) -> Promise|Array<B>
 */
const arrayMap = function (array, mapper) {
  const arrayLength = array.length,
    result = Array(arrayLength)
  let index = -1, isAsync = false
  while (++index < arrayLength) {
    const resultItem = mapper(array[index])
    if (isPromise(resultItem)) isAsync = true
    result[index] = resultItem
  }
  return isAsync ? promiseAll(result) : result
}

/**
 * @name arrayExtend
 *
 * @synopsis
 * arrayExtend(array Array, values Array) -> array
 */
const arrayExtend = (array, values) => {
  const arrayLength = array.length,
    valuesLength = values.length
  let valuesIndex = -1
  while (++valuesIndex < valuesLength) {
    array[arrayLength + valuesIndex] = values[valuesIndex]
  }
  return array
}

/**
 * @name asyncArrayFilter
 *
 * @benchmark
 * asyncArrayFilter1: isOdd: 1e+6: 488.869ms
 * asyncArrayFilter2: isOdd: 1e+6: 491.341ms
 * asyncArrayFilter1: asyncIsOdd: 1e+5: 138.23ms
 * asyncArrayFilter2: asyncIsOdd: 1e+5: 138.915ms
 */

const asyncArrayFilter1 = async function (array, predicate) {
  const arrayLength = array.length,
    result = [],
    shouldIncludeItemAtIndex = await arrayMap(array, predicate)
  let index = -1,
    resultIndex = -1
  while (++index < arrayLength) {
    if (shouldIncludeItemAtIndex[index]) {
      result[++resultIndex] = array[index]
    }
  }
  return result
}

const asyncArrayFilter2 = async function (array, predicate) {
  const shouldIncludeItemAtIndex = await arrayMap(array, predicate)
  return array.filter((_, index) => shouldIncludeItemAtIndex[index])
}

{
  const array = [1, 2, 3, 4, 5]

  const isOdd = number => number % 2 == 1

  const asyncIsOdd = async number => number % 2 == 1

  // asyncArrayFilter1(array, isOdd).then(console.log)
  // asyncArrayFilter2(array, isOdd).then(console.log)
  // asyncArrayFilter1(array, asyncIsOdd).then(console.log)
  // asyncArrayFilter2(array, asyncIsOdd).then(console.log)

  // timeInLoop.async('asyncArrayFilter1: isOdd', 1e6, () => asyncArrayFilter1(array, isOdd))

  // timeInLoop.async('asyncArrayFilter2: isOdd', 1e6, () => asyncArrayFilter2(array, isOdd))

  // timeInLoop.async('asyncArrayFilter1: asyncIsOdd', 1e5, () => asyncArrayFilter2(array, asyncIsOdd))

  // timeInLoop.async('asyncArrayFilter2: asyncIsOdd', 1e5, () => asyncArrayFilter2(array, asyncIsOdd))
}

/**
 * @name arrayFilter
 *
 * @benchmark
 * nativeArrayFilter: 1e+6: 62.137ms
 * nativeArrayFilterUnary: 1e+6: 64.374ms
 * arrayFilter1: 1e+6: 78.422ms
 * arrayFilter1ScopeTest: 1e+6: 70.671ms
 * arrayFilter1Sync: 1e+6: 68.359ms
 * arrayFilter2: 1e+6: 106.965ms
 * arrayFilter3: 1e+6: 74.412ms
 * arrayFilter30: 1e+6: 74.442ms
 */

const nativeArrayFilter = (array, predicate) => array.filter(predicate)

const nativeArrayFilterUnary = (array, predicate) => array.filter(item => predicate(item))

const arrayFilter1 = function (array, predicate) {
  const arrayLength = array.length,
    result = []
  let index = -1,
    resultIndex = -1
  while (++index < arrayLength) {
    const item = array[index]
    const shouldIncludeItem = predicate(item)
    if (isPromise(shouldIncludeItem)) {
      return promiseAll([
        shouldIncludeItem,
        asyncArrayFilter1(array.slice(index + 1), predicate),
      ]).then(function ([firstShouldIncludeItem, filteredRemainingItems]) {
        if (firstShouldIncludeItem) {
          result[resultIndex + 1] = item
        }
        return arrayExtend(result, filteredRemainingItems)
      })
    }
    if (shouldIncludeItem) {
      result[++resultIndex] = item
    }
  }
  return result
}

const arrayFilter1ScopeTest = function (array, predicate) {
  const arrayLength = array.length,
    result = []
  let index = -1,
    resultIndex = -1
  while (++index < arrayLength) {
    const item = array[index]
    const shouldIncludeItem = predicate(item)
    if (isPromise(shouldIncludeItem)) {
    }
    if (shouldIncludeItem) {
      result[++resultIndex] = item
    }
  }
  return result
}

const arrayFilter1Sync = function (array, predicate) {
  const arrayLength = array.length,
    result = []
  let index = -1,
    resultIndex = -1
  while (++index < arrayLength) {
    const item = array[index]
    if (predicate(item)) {
      result[++resultIndex] = item
    }
  }
  return result
}

const arrayFilter2 = function (array, predicate) {
  const shouldIncludeItemAtIndex = arrayMap(array, predicate)
  return isPromise(shouldIncludeItemAtIndex)
    ? shouldIncludeItemAtIndex.then(res => array.filter((_, index) => res[index]))
    : array.filter((_, index) => shouldIncludeItemAtIndex[index])
}

const _arrayFilter3AsyncInterlude1 = function (array, predicate, result, index, resultIndex, firstItem, shouldIncludeItem) {
  return promiseAll([
    shouldIncludeItem,
    asyncArrayFilter1(array.slice(index + 1), predicate),
  ]).then(function ([
    resolvedShouldIncludeItem,
    filteredRemainingItems,
  ]) {
    if (resolvedShouldIncludeItem) {
      result[resultIndex + 1] = firstItem
    }
    return arrayExtend(result, filteredRemainingItems)
  })
}

const arrayFilter3 = function (array, predicate) {
  const arrayLength = array.length,
    result = []
  let index = -1,
    resultIndex = -1
  while (++index < arrayLength) {
    const item = array[index]
    const shouldIncludeItem = predicate(item)
    if (isPromise(shouldIncludeItem)) {
      return _arrayFilter3AsyncInterlude1(array, predicate, result, index, resultIndex, item, shouldIncludeItem)
    }
    if (shouldIncludeItem) {
      result[++resultIndex] = item
    }
  }
  return result
}

const asyncArrayFilter1Interlude1 = async function (
  array, predicate, result, index, shouldIncludeItem,
) {
  const [
    resolvedShouldIncludeItem,
    filteredRemainingItems,
  ] = await promiseAll([
    shouldIncludeItem,
    asyncArrayFilter1(array.slice(index + 1), predicate),
  ])
  if (resolvedShouldIncludeItem) {
    result[result.length] = array[index]
  }
  return arrayExtend(result, filteredRemainingItems)
}

const arrayFilter30 = function (array, predicate) {
  const arrayLength = array.length,
    result = []
  let index = -1,
    resultIndex = -1
  while (++index < arrayLength) {
    const item = array[index]
    const shouldIncludeItem = predicate(item)
    if (isPromise(shouldIncludeItem)) {
      return asyncArrayFilter1Interlude1(
        array, predicate, result, index, shouldIncludeItem)
    }
    if (shouldIncludeItem) {
      result[++resultIndex] = item
    }
  }
  return result
}

{
  const array = [1, 2, 3, 4, 5]

  const isOdd = number => number % 2 == 1

  const asyncIsOdd = async number => number % 2 == 1

  // console.log(nativeArrayFilter(array, isOdd))
  // console.log(nativeArrayFilterUnary(array, isOdd))
  // console.log(arrayFilter1(array, isOdd))
  // console.log(arrayFilter1ScopeTest(array, isOdd))
  // console.log(arrayFilter1Sync(array, isOdd))
  // console.log(arrayFilter2(array, isOdd))
  // console.log(arrayFilter3(array, isOdd))
  // arrayFilter3(array, asyncIsOdd).then(console.log)
  // arrayFilter30(array, asyncIsOdd).then(console.log)

  // timeInLoop('nativeArrayFilter', 1e6, () => nativeArrayFilter(array, isOdd))

  // timeInLoop('nativeArrayFilterUnary', 1e6, () => nativeArrayFilterUnary(array, isOdd))

  // timeInLoop('arrayFilter1', 1e6, () => arrayFilter1(array, isOdd))

  // timeInLoop('arrayFilter1ScopeTest', 1e6, () => arrayFilter1ScopeTest(array, isOdd))

  // timeInLoop('arrayFilter1Sync', 1e6, () => arrayFilter1Sync(array, isOdd))

  // timeInLoop('arrayFilter2', 1e6, () => arrayFilter2(array, isOdd))

  // timeInLoop('arrayFilter3', 1e6, () => arrayFilter3(array, isOdd))

  // timeInLoop('arrayFilter30', 1e6, () => arrayFilter30(array, isOdd))
}

/**
 * @name objectFilter
 *
 * @benchmark
 * objectFilter0: 1e+6: 227.187ms
 * objectFilter1: 1e+6: 138.815ms
 * objectFilter2: 1e+6: 136.23ms
 * objectFilter3: 1e+6: 136.15ms
 *
 * objectFilter0: async: 1e+5: 209.209ms
 * objectFilter1: async: 1e+5: 192.017ms
 * objectFilter2: async: 1e+5: 186.799ms
 * objectFilter3: async: 1e+5: 198.939ms
 */


const objectFilter0 = function (object, predicate) {
  const result = {},
    promises = []
  for (const key in object) {
    const item = object[key]
    const shouldIncludeItem = predicate(item)
    if (isPromise(shouldIncludeItem)) {
      promises[promises.length] = shouldIncludeItem.then(
        function (res) {
          if (res) {
            result[key] = object[key]
          }
        },
      )
    } else if (shouldIncludeItem) {
      result[key] = item
    }
  }
  return promises.length == 0 ? result : promiseAll(promises).then(() => result)
}

const _pushSetIfShouldIncludeItemPromise = function (
  object, result, promises, key, shouldIncludeItemPromise,
) {
  promises[promises.length] = shouldIncludeItemPromise.then(
    function (shouldIncludeItem) {
      if (shouldIncludeItem) {
        result[key] = object[key]
      }
    },
  )
}

const _tapPossiblePromiseAllThenResolve = (promises, value) => promises.length == 0
  ? value
  : promiseAll(promises).then(() => value)

const objectFilter1 = function (object, predicate) {
  const result = {},
    promises = []
  for (const key in object) {
    const item = object[key]
    const shouldIncludeItem = predicate(item)
    if (isPromise(shouldIncludeItem)) {
      _pushSetIfShouldIncludeItemPromise(
        object, result, promises, key, shouldIncludeItem)
    } else if (shouldIncludeItem) {
      result[key] = item
    }
  }
  return _tapPossiblePromiseAllThenResolve(promises, result)
}

const _setIfShouldIncludeItem = (
  object, result, key,
) => function settingIfShouldIncludeItem(shouldIncludeItem) {
  if (shouldIncludeItem) {
    result[key] = object[key]
  }
}

const _pushSetIfShouldIncludeItemPromiseRefactorInner = function (
  object, result, promises, key, shouldIncludeItemPromise,
) {
  promises[promises.length] = shouldIncludeItemPromise.then(
    _setIfShouldIncludeItem(object, result, key))
}

const objectFilter2 = function (object, predicate) {
  const result = {},
    promises = []
  for (const key in object) {
    const item = object[key]
    const shouldIncludeItem = predicate(item)
    if (isPromise(shouldIncludeItem)) {
      _pushSetIfShouldIncludeItemPromiseRefactorInner(
        object, result, promises, key, shouldIncludeItem)
    } else if (shouldIncludeItem) {
      result[key] = item
    }
  }
  return _tapPossiblePromiseAllThenResolve(promises, result)
}

const nativePromiseThen = Promise.prototype.then

const promiseThen = (promise, func) => nativePromiseThen.call(promise, func)

const _pushSetIfShouldIncludeItemPromiseRefactorInnerPromiseThen = function (
  object, result, promises, key, shouldIncludeItemPromise,
) {
  const setIfShouldIncludeItem = _setIfShouldIncludeItem(object, result, key)
  promises[promises.length] = promiseThen(
    shouldIncludeItemPromise, setIfShouldIncludeItem)
}

const objectFilter3 = function (object, predicate) {
  const result = {},
    promises = []
  for (const key in object) {
    const item = object[key]
    const shouldIncludeItem = predicate(item)
    if (isPromise(shouldIncludeItem)) {
      _pushSetIfShouldIncludeItemPromiseRefactorInnerPromiseThen(
        object, result, promises, key, shouldIncludeItem)
    } else if (shouldIncludeItem) {
      result[key] = item
    }
  }
  return _tapPossiblePromiseAllThenResolve(promises, result)
}

{
  const object = { a: 1, b: 2, c: 3, d: 4, e: 5 }

  const isOdd = number => number % 2 == 1

  const asyncIsOdd = async number => number % 2 == 1

  // console.log(objectFilter0(object, isOdd))
  // console.log(objectFilter1(object, isOdd))
  // console.log(objectFilter2(object, isOdd))
  // console.log(objectFilter3(object, isOdd))
  // objectFilter3(object, asyncIsOdd).then(console.log)

  // timeInLoop('objectFilter0', 1e6, () => objectFilter0(object, isOdd))

  // timeInLoop('objectFilter1', 1e6, () => objectFilter1(object, isOdd))

  // timeInLoop('objectFilter2', 1e6, () => objectFilter2(object, isOdd))

  // timeInLoop('objectFilter3', 1e6, () => objectFilter3(object, isOdd))

  // timeInLoop.async('objectFilter0: async', 1e5, () => objectFilter0(object, asyncIsOdd))

  // timeInLoop.async('objectFilter1: async', 1e5, () => objectFilter1(object, asyncIsOdd))

  // timeInLoop.async('objectFilter2: async', 1e5, () => objectFilter2(object, asyncIsOdd))

  // timeInLoop.async('objectFilter3: async', 1e5, () => objectFilter3(object, asyncIsOdd))
}

/**
* @name generatorFunctionFilter
*
* @benchmark
* generatorFunctionFilter1: 1e+5: 97.002ms
*/

const generatorFunctionFilter1 = (
  generatorFunction, predicate,
) => function* filteringGeneratorFunction(...args) {
  for (const item of generatorFunction(...args)) {
    if (predicate(item)) {
      yield item
    }
  }
}

{
  const numbers = function* () {
    yield 1; yield 2; yield 3; yield 4; yield 5
  }

  const isOdd = number => number % 2 == 1

  // console.log([...generatorFunctionFilter1(numbers, isOdd)()])

  const _generatorFunctionFilter1 = generatorFunctionFilter1(numbers, isOdd)

  // timeInLoop('generatorFunctionFilter1', 1e5, () => [..._generatorFunctionFilter1()])
}

/**
 * @name FilteringIterator
 *
 * @benchmark
 * iteratorFilter0: 1e+5: 85.751ms
 * iteratorFilter1: 1e+5: 70.104ms
 */

const iteratorFilter0 = function* (iter, predicate) {
  for (const item of iter) {
    if (predicate(item)) {
      yield item
    }
  }
}

const FilteringIterator = function (iter, predicate) {
  this.iter = iter
  this.predicate = predicate
}

FilteringIterator.prototype[symbolIterator] = function filteringValues() {
  return this
}

FilteringIterator.prototype.next = function next() {
  const thisIterNext = this.iter.next.bind(this.iter),
    thisPredicate = this.predicate
  let iteration = this.iter.next()
  while (!iteration.done) {
    const { value } = iteration
    if (thisPredicate(value)) {
      return { value, done: false }
    }
    iteration = thisIterNext()
  }
  return { value: undefined, done: true }
}

{
  const isOdd = number => number % 2 == 1

  const numbers = function* () { let i = 0; while (++i < 6) yield i }

  const iteratorFilter1 = (iter, predicate) => new FilteringIterator(iter, predicate)

  // console.log([...iteratorFilter0(numbers(), isOdd)])
  // console.log([...iteratorFilter1(numbers(), isOdd)])

  // timeInLoop('iteratorFilter0', 1e5, () => [...iteratorFilter0(numbers(), isOdd)])

  // timeInLoop('iteratorFilter1', 1e5, () => [...iteratorFilter1(numbers(), isOdd)])
}

/**
 * @name asyncGeneratorFunctionFilter
 *
 * @benchmark
 * asyncGeneratorFunctionFilter1: 1e+5: 367.211ms
 *
 * asyncGeneratorFunctionFilter1AsyncPredicate: 1e+5: 427.324ms
 */

const asyncGeneratorFunctionFilter1 = function (asyncGeneratorFunction, predicate) {
  return async function* filteringAsyncGeneratorFunction(...args) {
    for await (const item of asyncGeneratorFunction(...args)) {
      const shouldIncludeItem = predicate(item)
      if (
        isPromise(shouldIncludeItem)
          ? await shouldIncludeItem
          : shouldIncludeItem
      ) {
        yield item
      }
    }
  }
}

{
  const asyncNumbers = async function* () { let i = 0; while (++i < 6) yield i }

  const isOdd = number => number % 2 == 1

  const asyncIsOdd = async number => number % 2 == 1

  const _asyncGeneratorFilteringFunction1 = asyncGeneratorFunctionFilter1(asyncNumbers, isOdd)

  const _asyncGeneratorFilteringFunction1AsyncPredicate = asyncGeneratorFunctionFilter1(asyncNumbers, asyncIsOdd)

  // asyncIteratorToArray(_asyncGeneratorFilteringFunction1()).then(console.log)
  // asyncIteratorToArray(_asyncGeneratorFilteringFunction1Async()).then(console.log)

  // timeInLoop.async('asyncGeneratorFunctionFilter1', 1e5, () => asyncIteratorToArray(_asyncGeneratorFilteringFunction1()))

  // timeInLoop.async('asyncGeneratorFunctionFilter1AsyncPredicate', 1e5, () => asyncIteratorToArray(_asyncGeneratorFilteringFunction1AsyncPredicate()))
}

/**
 * @name FilteringAsyncIterator
 *
 * @benchmark
 * asyncIteratorFilter0: 1e+5: 431.374ms
 * asyncIteratorFilter1: 1e+5: 316.587ms
 *
 * asyncIteratorFilter0: AsyncPredicate: 1e+5: 434.51ms
 * asyncIteratorFilter1: AsyncPredicate: 1e+5: 371.103ms
 */

const asyncIteratorFilter0 = async function* (asyncIter, predicate) {
  for await (const item of asyncIter) {
    if (await predicate(item)) {
      yield item
    }
  }
}

const FilteringAsyncIterator = function (asyncIter, predicate) {
  this.asyncIter = asyncIter
  this.predicate = predicate
}

FilteringAsyncIterator.prototype[symbolAsyncIterator] = function filteringValues() {
  return this
}

FilteringAsyncIterator.prototype.next = async function next() {
  const thisIterNext = this.asyncIter.next.bind(this.asyncIter),
    thisPredicate = this.predicate
  let iteration = await thisIterNext()
  while (!iteration.done) {
    const { value } = iteration
    const shouldIncludeItem = thisPredicate(value)
    if (
      isPromise(shouldIncludeItem)
        ? await shouldIncludeItem
        : shouldIncludeItem
    ) {
      return { value, done: false }
    }
    iteration = await thisIterNext()
  }
  return { value: undefined, done: true }
}

const asyncIteratorFilter1 = (iter, predicate) => new FilteringAsyncIterator(iter, predicate)

{
  const isOdd = number => number % 2 == 1

  const asyncIsOdd = async number => number % 2 == 1

  const asyncNumbers = async function* () { let i = 0; while (++i < 6) yield i }

  // asyncIteratorToArray(asyncIteratorFilter0(asyncNumbers(), isOdd)).then(res => console.log('asyncIteratorFilter0', res))
  // asyncIteratorToArray(asyncIteratorFilter1(asyncNumbers(), isOdd)).then(res => console.log('asyncIteratorFilter1', res))

  // timeInLoop.async('asyncIteratorFilter0', 1e5, () => asyncIteratorToArray(asyncIteratorFilter0(asyncNumbers(), isOdd)))

  // timeInLoop.async('asyncIteratorFilter1', 1e5, () => asyncIteratorToArray(asyncIteratorFilter1(asyncNumbers(), isOdd)))

  //timeInLoop.async('asyncIteratorFilter0: AsyncPredicate', 1e5, () => asyncIteratorToArray(asyncIteratorFilter0(asyncNumbers(), asyncIsOdd)))

  // timeInLoop.async('asyncIteratorFilter1: AsyncPredicate', 1e5, () => asyncIteratorToArray(asyncIteratorFilter1(asyncNumbers(), asyncIsOdd)))
}

/**
 * @name reducerFilter
 *
 * @benchmark
 * reducerFilter0: 1e+5: 247.22ms
 * reducerFilter1: 1e+5: 242.314ms
 * reducerFilter2: 1e+5: 233.471ms
 *
 * reducerFilter0: async: 1e+5: 304.144ms
 * reducerFilter1: async: 1e+5: 330.365ms
 * reducerFilter2: async: 1e+5: 302.424ms
 */

const reducerFilter0 = (
  reducer, predicate,
) => function filteringReducer(accumulator, item) {
  const shouldIncludeItem = predicate(item)
  if (isPromise(shouldIncludeItem)) {
    return shouldIncludeItem.then(res =>
      res ? reducer(accumulator, item) : accumulator)
  }
  return shouldIncludeItem ? reducer(accumulator, item) : accumulator
}

const _asyncReducerFiltration = async function (
  reducer, accumulator, item, shouldIncludeItemPromise,
) {
  return await shouldIncludeItemPromise
    ? reducer(accumulator, item)
    : accumulator
}

const reducerFilter1 = (
  reducer, predicate,
) => function filteringReducer(accumulator, item) {
  const shouldIncludeItem = predicate(item)
  if (isPromise(shouldIncludeItem)) {
    return _asyncReducerFiltration(
      reducer, accumulator, item, shouldIncludeItem)
  }
  return shouldIncludeItem ? reducer(accumulator, item) : accumulator
}

const _asyncReducerFiltrationPromise = (
  reducer, accumulator, item, shouldIncludeItemPromise,
) => shouldIncludeItemPromise.then(
  res => res ? reducer(accumulator, item) : accumulator)

const reducerFilter2 = (
  reducer, predicate,
) => function filteringReducer(accumulator, item) {
  const shouldIncludeItem = predicate(item)
  if (isPromise(shouldIncludeItem)) {
    return _asyncReducerFiltrationPromise(
      reducer, accumulator, item, shouldIncludeItem)
  }
  return shouldIncludeItem ? reducer(accumulator, item) : accumulator
}

{
  const numbers = [1, 2, 3, 4, 5]

  const arrayConcat = (arrA, arrB) => arrA.concat(arrB)

  const isOdd = number => number % 2 == 1

  const asyncIsOdd = async number => number % 2 == 1

  // console.log(numbers.reduce(reducerFilter0(arrayConcat, isOdd), []))
  // console.log(numbers.reduce(reducerFilter1(arrayConcat, isOdd), []))
  // console.log(numbers.reduce(reducerFilter2(arrayConcat, isOdd), []))
  // asyncArrayReduce(numbers, reducerFilter0(arrayConcat, asyncIsOdd), []).then(console.log)
  // asyncArrayReduce(numbers, reducerFilter1(arrayConcat, asyncIsOdd), []).then(console.log)
  // asyncArrayReduce(numbers, reducerFilter2(arrayConcat, asyncIsOdd), []).then(console.log)

  // timeInLoop.async('reducerFilter0', 1e5, () => asyncArrayReduce(numbers, reducerFilter0(arrayConcat, isOdd), []))

  // timeInLoop.async('reducerFilter1', 1e5, () => asyncArrayReduce(numbers, reducerFilter1(arrayConcat, isOdd), []))

  // timeInLoop.async('reducerFilter2', 1e5, () => asyncArrayReduce(numbers, reducerFilter2(arrayConcat, isOdd), []))

  // timeInLoop.async('reducerFilter0: async', 1e5, () => asyncArrayReduce(numbers, reducerFilter0(arrayConcat, asyncIsOdd), []))

  // timeInLoop.async('reducerFilter1: async', 1e5, () => asyncArrayReduce(numbers, reducerFilter1(arrayConcat, asyncIsOdd), []))

  // timeInLoop.async('reducerFilter2: async', 1e5, () => asyncArrayReduce(numbers, reducerFilter2(arrayConcat, asyncIsOdd), []))
}
