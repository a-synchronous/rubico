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
 * arrayFilter5: 1e+6: 73.663ms
 * arrayFilter6: 1e+6: 73.266ms
 *
 * arrayFilter1 - async: 1e+5: 222.846ms
 * arrayFilter2 - async: 1e+5: 144.018ms
 * arrayFilter3 - async: 1e+5: 235.657ms
 * arrayFilter30 - async: 1e+5: 245.06ms
 * arrayFilter5 - async: 1e+5: 138.895ms
 * arrayFilter6 - async: 1e+5: 133.806ms
 *
 * @NOTE Bo5
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

const _shouldIncludeItemsResolver = (
  array, result, index,
) => function resolvingShouldIncludeItems(shouldIncludeItems) {
  const arrayLength = array.length
  let resultIndex = result.length - 1,
    shouldIncludeItemsIndex = -1
  while (++index < arrayLength) {
    if (shouldIncludeItems[++shouldIncludeItemsIndex]) {
      result[++resultIndex] = array[index]
    }
  }
  return result
}

const _arrayExtendMap = function (
  array, values, valuesMapper, valuesIndex,
) {
  const valuesLength = values.length
  let arrayIndex = array.length - 1
  while (++valuesIndex < valuesLength) {
    array[++arrayIndex] = valuesMapper(values[valuesIndex])
  }
  return array
}

const _asyncArrayFilter5 = (
  array, predicate, result, index, shouldIncludeItemPromises,
) => promiseAll(
  _arrayExtendMap(
    shouldIncludeItemPromises, array, predicate, index)).then(
      _shouldIncludeItemsResolver(array, result, index - 1))

const arrayFilter5 = function (array, predicate) {
  const arrayLength = array.length,
    result = []
  let index = -1,
    resultIndex = -1
  while (++index < arrayLength) {
    const item = array[index]
    const shouldIncludeItem = predicate(item)
    if (isPromise(shouldIncludeItem)) {
      return _asyncArrayFilter5(
        array, predicate, result, index, [shouldIncludeItem])
    }
    if (shouldIncludeItem) {
      result[++resultIndex] = item
    }
  }
  return result
}

const arrayExtendMap = function (
  array, values, valuesMapper, valuesIndex,
) {
  const valuesLength = values.length
  let arrayIndex = array.length - 1
  while (++valuesIndex < valuesLength) {
    array[++arrayIndex] = valuesMapper(values[valuesIndex])
  }
  return array
}

const arrayFilterConditionsResolver = (
  array, result, index,
) => function resolvingShouldIncludeItems(shouldIncludeItems) {
  const arrayLength = array.length
  let resultIndex = result.length - 1,
    shouldIncludeItemsIndex = -1
  while (++index < arrayLength) {
    if (shouldIncludeItems[++shouldIncludeItemsIndex]) {
      result[++resultIndex] = array[index]
    }
  }
  return result
}

const arrayFilter6 = function (array, predicate) {
  const arrayLength = array.length,
    result = []
  let index = -1,
    resultIndex = -1
  while (++index < arrayLength) {
    const item = array[index]
    const shouldIncludeItem = predicate(item)
    if (isPromise(shouldIncludeItem)) {
      return promiseAll(
        arrayExtendMap(
          [shouldIncludeItem], array, predicate, index)).then(
            arrayFilterConditionsResolver(array, result, index - 1))
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
  // console.log(arrayFilter5(array, isOdd))
  // console.log(arrayFilter6(array, isOdd))
  // arrayFilter3(array, asyncIsOdd).then(console.log)
  // arrayFilter30(array, asyncIsOdd).then(console.log)
  // arrayFilter5(array, asyncIsOdd).then(console.log)
  // arrayFilter6(array, asyncIsOdd).then(console.log)

  // timeInLoop('nativeArrayFilter', 1e6, () => nativeArrayFilter(array, isOdd))

  // timeInLoop('nativeArrayFilterUnary', 1e6, () => nativeArrayFilterUnary(array, isOdd))

  // timeInLoop('arrayFilter1', 1e6, () => arrayFilter1(array, isOdd))

  // timeInLoop('arrayFilter1ScopeTest', 1e6, () => arrayFilter1ScopeTest(array, isOdd))

  // timeInLoop('arrayFilter1Sync', 1e6, () => arrayFilter1Sync(array, isOdd))

  // timeInLoop('arrayFilter2', 1e6, () => arrayFilter2(array, isOdd))

  // timeInLoop('arrayFilter3', 1e6, () => arrayFilter3(array, isOdd))

  // timeInLoop('arrayFilter30', 1e6, () => arrayFilter30(array, isOdd))

  // timeInLoop('arrayFilter5', 1e6, () => arrayFilter5(array, isOdd))

  // timeInLoop('arrayFilter6', 1e6, () => arrayFilter6(array, isOdd))

  // timeInLoop.async('arrayFilter1 - async', 1e5, () => arrayFilter1(array, asyncIsOdd))

  // timeInLoop.async('arrayFilter2 - async', 1e5, () => arrayFilter2(array, asyncIsOdd))

  // timeInLoop.async('arrayFilter3 - async', 1e5, () => arrayFilter3(array, asyncIsOdd))

  // timeInLoop.async('arrayFilter30 - async', 1e5, () => arrayFilter30(array, asyncIsOdd))

  // timeInLoop.async('arrayFilter5 - async', 1e5, () => arrayFilter5(array, asyncIsOdd))

  // timeInLoop.async('arrayFilter6 - async', 1e5, () => arrayFilter6(array, asyncIsOdd))
}

/**
 * @name objectFilter
 *
 * @benchmark
 * objectFilter0: 1e+6: 227.187ms
 * objectFilter1: 1e+6: 138.815ms
 * objectFilter2: 1e+6: 136.23ms
 * objectFilter3: 1e+6: 136.15ms
 * objectFilter5: 1e+6: 137.69ms
 *
 * objectFilter0: async: 1e+5: 209.209ms
 * objectFilter1: async: 1e+5: 192.017ms
 * objectFilter2: async: 1e+5: 186.799ms
 * objectFilter3: async: 1e+5: 198.939ms
 * objectFilter5: async: 1e+5: 190.143ms
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

const objectSetConditionalResolver = (
  object, result, key,
) => function settingValueIfTruthy(shouldIncludeItem) {
  if (shouldIncludeItem) {
    result[key] = object[key]
  }
}

const always = value => function getter() { return value }

const objectFilter5 = function (object, predicate) {
  const result = {},
    promises = []
  for (const key in object) {
    const item = object[key]
    const shouldIncludeItem = predicate(item)
    if (isPromise(shouldIncludeItem)) {
      promises[promises.length] = shouldIncludeItem.then(
        objectSetConditionalResolver(object, result, key))
    } else if (shouldIncludeItem) {
      result[key] = item
    }
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(always(result))
}

{
  const object = { a: 1, b: 2, c: 3, d: 4, e: 5 }

  const isOdd = number => number % 2 == 1

  const asyncIsOdd = async number => number % 2 == 1

  // console.log(objectFilter0(object, isOdd))
  // console.log(objectFilter1(object, isOdd))
  // console.log(objectFilter2(object, isOdd))
  // console.log(objectFilter3(object, isOdd))
  // console.log(objectFilter5(object, isOdd))
  // objectFilter3(object, asyncIsOdd).then(console.log)
  // objectFilter5(object, asyncIsOdd).then(console.log)

  // timeInLoop('objectFilter0', 1e6, () => objectFilter0(object, isOdd))

  // timeInLoop('objectFilter1', 1e6, () => objectFilter1(object, isOdd))

  // timeInLoop('objectFilter2', 1e6, () => objectFilter2(object, isOdd))

  // timeInLoop('objectFilter3', 1e6, () => objectFilter3(object, isOdd))

  // timeInLoop('objectFilter5', 1e6, () => objectFilter5(object, isOdd))

  // timeInLoop.async('objectFilter0: async', 1e5, () => objectFilter0(object, asyncIsOdd))

  // timeInLoop.async('objectFilter1: async', 1e5, () => objectFilter1(object, asyncIsOdd))

  // timeInLoop.async('objectFilter2: async', 1e5, () => objectFilter2(object, asyncIsOdd))

  // timeInLoop.async('objectFilter3: async', 1e5, () => objectFilter3(object, asyncIsOdd))

  // timeInLoop.async('objectFilter5: async', 1e5, () => objectFilter5(object, asyncIsOdd))
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

/**
 * @name arrayFilterWithIndex
 *
 * @benchmark
 * arrayFilterWithIndex0: 1e+6: 120.52ms
 * arrayFilterWithIndex1: 1e+6: 73.923ms
 * arrayFilterWithIndex2: 1e+6: 75.2ms
 * arrayFilterWithIndex3: 1e+6: 73.448ms
 * arrayFilterWithIndex30: 1e+6: 74.345ms
 * arrayFilterWithIndex31: 1e+6: 76.641ms
 * arrayFilterWithIndex32: 1e+6: 74.355ms
 * arrayFilterWithIndex33: 1e+6: 73.379ms
 *
 * arrayFilterWithIndex0 - async: 1e+5: 129.733ms
 * arrayFilterWithIndex1 - async: 1e+5: 249.433ms
 * arrayFilterWithIndex2 - async: 1e+5: 279.556ms
 * arrayFilterWithIndex3 - async: 1e+5: 153.114ms
 * arrayFilterWithIndex30 - async: 1e+5: 154.646ms
 * arrayFilterWithIndex31 - async: 1e+5: 139.632ms
 * arrayFilterWithIndex32 - async: 1e+5: 136.089ms
 * arrayFilterWithIndex33 - async: 1e+5: 135.066ms
 */

const arrayFilterWithIndex0 = function (array, predicate) {
  let isAsync = false
  const shouldIncludeItemArray = array.map(function (item) {
    const shouldIncludeItem = predicate(item)
    if (isPromise(shouldIncludeItem)) isAsync = true
    return shouldIncludeItem
  })
  return isAsync
    ? promiseAll(shouldIncludeItemArray).then(
      res => array.filter((_, index) => res[index]))
    : array.filter((_, index) => shouldIncludeItemArray[index])
}

const arrayMapWithIndex = function (array, mapper) {
  const arrayLength = array.length,
    result = Array(arrayLength)
  let index = -1, isAsync = false
  while (++index < arrayLength) {
    const resultItem = mapper(array[index], index, array)
    if (isPromise(resultItem)) isAsync = true
    result[index] = resultItem
  }
  return isAsync ? promiseAll(result) : result
}

const asyncArrayFilterWithIndex1 = async function (array, predicate) {
  const arrayLength = array.length,
    result = [],
    shouldIncludeItemAtIndex = await arrayMapWithIndex(array, predicate)
  let index = -1,
    resultIndex = -1
  while (++index < arrayLength) {
    if (shouldIncludeItemAtIndex[index]) {
      result[++resultIndex] = array[index]
    }
  }
  return result
}

const asyncArrayFilterWithIndexInterlude1 = async function (
  array, predicate, result, index, shouldIncludeFirstItemPromise,
) {
  const [
    shouldIncludeFirstItem,
    filteredRemainingItems,
  ] = await promiseAll([
    shouldIncludeFirstItemPromise,
    asyncArrayFilterWithIndex1(array.slice(index + 1), predicate),
  ])
  if (shouldIncludeFirstItem) {
    result[result.length] = array[index]
  }
  return arrayExtend(result, filteredRemainingItems)
}

const arrayFilterWithIndex1 = function (array, predicate) {
  const arrayLength = array.length,
    result = []
  let index = -1,
    resultIndex = -1
  while (++index < arrayLength) {
    const item = array[index]
    const shouldIncludeItem = predicate(item, index, array)
    if (isPromise(shouldIncludeItem)) {
      return asyncArrayFilterWithIndexInterlude1(
        array, predicate, result, index, shouldIncludeItem)
    }
    if (shouldIncludeItem) {
      result[++resultIndex] = item
    }
  }
  return result
}

const _arraySetter = (array, index) => function arraySet(value) {
  array[index] = value
}

const _asyncSliceMapWithIndexContinued = async function (
  array, toIndex, mapper, result, index, resultIndex, promises,
) {
  let promisesIndex = promises.length - 1
  while (++index < toIndex) {
    const resultItem = mapper(array[index], index, array)
    if (isPromise(resultItem)) {
      promises[++promisesIndex] = resultItem.then(
        _arraySetter(result, ++resultIndex))
    } else {
      result[++resultIndex] = result
    }
  }
  if (promisesIndex == -1) {
    return result
  }
  await promiseAll(promises)
  return result
}

const sliceMapWithIndex = function (array, fromIndex, toIndex, mapper) {
  const result = Array(toIndex - fromIndex)
  let index = fromIndex - 1,
    resultIndex = -1
  while (++index < toIndex) {
    const resultItem = mapper(array[index], index, array)
    if (isPromise(resultItem)) {
      const promises = [resultItem.then(_arraySetter(result, ++resultIndex))]
      return _asyncSliceMapWithIndexContinued(
        array, toIndex, mapper, result, index, resultIndex, promises)
    }
    result[++resultIndex] = resultItem
  }
  return result
}

const _asyncArrayFilterWithIndex2 = async function (
  array, predicate, result, index, shouldIncludeFirstItemPromise,
) {
  const arrayLength = array.length,
    resultOffset = result.length + 1,
    [
      shouldIncludeFirstItem,
      shouldIncludeRemainingItems,
    ] = await promiseAll([
      shouldIncludeFirstItemPromise,
      sliceMapWithIndex(array, index + 1, array.length, predicate),
    ])
  let resultIndex = result.length - 1
  if (shouldIncludeFirstItem) {
    result[++resultIndex] = array[index]
  }
  while (++index < arrayLength) {
    if (shouldIncludeRemainingItems[index - resultOffset]) {
      result[++resultIndex] = array[index]
    }
  }
  return result
}

const arrayFilterWithIndex2 = function (array, predicate) {
  const arrayLength = array.length,
    result = []
  let index = -1,
    resultIndex = -1
  while (++index < arrayLength) {
    const item = array[index]
    const shouldIncludeItem = predicate(item, index, array)
    if (isPromise(shouldIncludeItem)) {
      return _asyncArrayFilterWithIndex2(
        array, predicate, result, index, shouldIncludeItem)
    }
    if (shouldIncludeItem) {
      result[++resultIndex] = item
    }
  }
  return result
}

const _asyncArrayFilterWithIndex3 = function (array, predicate, result, index) {
  const remainingItems = array.slice(index)
  const shouldIncludeItemPromises = remainingItems.map(
    item => predicate(item, ++index, array))
  return promiseAll(shouldIncludeItemPromises).then(res =>
    arrayExtend(result, remainingItems.filter((_, index) => res[index])))
}

const arrayFilterWithIndex3 = function (array, predicate) {
  const arrayLength = array.length,
    result = []
  let index = -1,
    resultIndex = -1
  while (++index < arrayLength) {
    const item = array[index]
    const shouldIncludeItem = predicate(item, index, array)
    if (isPromise(shouldIncludeItem)) {
      return _asyncArrayFilterWithIndex3(array, predicate, result, index)
    }
    if (shouldIncludeItem) {
      result[++resultIndex] = item
    }
  }
  return result
}

const _asyncArrayFilterWithIndex30 = function (
  array, predicate, result, index, shouldIncludeItemPromises,
) {
  const arrayLength = array.length,
    remainingItems = array.slice(index)
  let booleanPromisesIndex = 0
  while (++index < array.length) {
    shouldIncludeItemPromises[++booleanPromisesIndex] = predicate(
      array[index], index, array)
  }
  return promiseAll(shouldIncludeItemPromises).then(res =>
    arrayExtend(result, remainingItems.filter((_, index) => res[index])))
}

const arrayFilterWithIndex30 = function (array, predicate) {
  const arrayLength = array.length,
    result = []
  let index = -1,
    resultIndex = -1
  while (++index < arrayLength) {
    const item = array[index]
    const shouldIncludeItem = predicate(item, index, array)
    if (isPromise(shouldIncludeItem)) {
      return _asyncArrayFilterWithIndex30(array, predicate, result, index, [shouldIncludeItem])
    }
    if (shouldIncludeItem) {
      result[++resultIndex] = item
    }
  }
  return result
}

const _asyncArrayFilterWithIndex31 = function (
  array, predicate, result, index, shouldIncludeItemPromises,
) {
  const arrayLength = array.length
  let booleanPromisesIndex = 0,
    indexCopy = index
  while (++index < arrayLength) {
    shouldIncludeItemPromises[++booleanPromisesIndex] = predicate(
      array[index], index, array)
  }
  index = indexCopy - 1
  return promiseAll(shouldIncludeItemPromises).then(function (res) {
    let resultIndex = result.length - 1,
      resIndex = -1
    while (++index < arrayLength) {
      if (res[++resIndex]) {
        result[++resultIndex] = array[index]
      }
    }
    return result
  })
}

const arrayFilterWithIndex31 = function (array, predicate) {
  const arrayLength = array.length,
    result = []
  let index = -1,
    resultIndex = -1
  while (++index < arrayLength) {
    const item = array[index]
    const shouldIncludeItem = predicate(item, index, array)
    if (isPromise(shouldIncludeItem)) {
      return _asyncArrayFilterWithIndex31(array, predicate, result, index, [shouldIncludeItem])
    }
    if (shouldIncludeItem) {
      result[++resultIndex] = item
    }
  }
  return result
}

const _arrayExtendMapWithIndex = function (array, values, valuesIndex, predicate) {
  const valuesLength = values.length
  let arrayIndex = array.length - 1
  while (++valuesIndex < valuesLength) {
    array[++arrayIndex] = predicate(
      values[valuesIndex], valuesIndex, values)
  }
  return array
}

const _asyncArrayFilterWithIndex32 = (
  array, predicate, result, index, shouldIncludeItemPromises,
) => promiseAll(
  _arrayExtendMapWithIndex(
    shouldIncludeItemPromises, array, index, predicate)).then(
      _shouldIncludeItemsResolver(array, result, index))

const arrayFilterWithIndex32 = function (array, predicate) {
  const arrayLength = array.length,
    result = []
  let index = -1,
    resultIndex = -1
  while (++index < arrayLength) {
    const item = array[index]
    const shouldIncludeItem = predicate(item, index, array)
    if (isPromise(shouldIncludeItem)) {
      return _asyncArrayFilterWithIndex32(
        array, predicate, result, index, [shouldIncludeItem])
    }
    if (shouldIncludeItem) {
      result[++resultIndex] = item
    }
  }
  return result
}

const shouldIncludeItemsResolver = (
  array, result, index,
) => function resolvingShouldIncludeItems(shouldIncludeItems) {
  const arrayLength = array.length
  let resultIndex = result.length - 1,
    shouldIncludeItemsIndex = -1
  while (++index < arrayLength) {
    if (shouldIncludeItems[++shouldIncludeItemsIndex]) {
      result[++resultIndex] = array[index]
    }
  }
  return result
}

const arrayExtendMapWithIndex = function (
  array, values, valuesMapper, valuesIndex,
) {
  const valuesLength = values.length
  let arrayIndex = array.length - 1
  while (++valuesIndex < valuesLength) {
    array[++arrayIndex] = valuesMapper(
      values[valuesIndex], valuesIndex, values)
  }
  return array
}

const arrayFilterWithIndex33 = function (array, predicate) {
  const arrayLength = array.length,
    result = []
  let index = -1,
    resultIndex = -1
  while (++index < arrayLength) {
    const item = array[index]
    const shouldIncludeItem = predicate(item, index, array)
    if (isPromise(shouldIncludeItem)) {
      return promiseAll(
        arrayExtendMapWithIndex(
          [shouldIncludeItem], array, predicate, index)).then(
            shouldIncludeItemsResolver(array, result, index - 1))
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

  // console.log(arrayFilterWithIndex0(array, isOdd))
  // console.log(arrayFilterWithIndex1(array, isOdd))
  // console.log(arrayFilterWithIndex2(array, isOdd))
  // console.log(arrayFilterWithIndex3(array, isOdd))
  // console.log(arrayFilterWithIndex30(array, isOdd))
  // console.log(arrayFilterWithIndex31(array, isOdd))
  // console.log(arrayFilterWithIndex32(array, isOdd))
  // console.log(arrayFilterWithIndex33(array, isOdd))
  // arrayFilterWithIndex0(array, asyncIsOdd).then(console.log)
  // arrayFilterWithIndex1(array, asyncIsOdd).then(console.log)
  // arrayFilterWithIndex2(array, asyncIsOdd).then(console.log)
  // arrayFilterWithIndex3(array, asyncIsOdd).then(console.log)
  // arrayFilterWithIndex30(array, asyncIsOdd).then(console.log)
  // arrayFilterWithIndex31(array, asyncIsOdd).then(console.log)
  // arrayFilterWithIndex32(array, asyncIsOdd).then(console.log)
  // arrayFilterWithIndex33(array, asyncIsOdd).then(console.log)

  // timeInLoop('arrayFilterWithIndex0', 1e6, () => arrayFilterWithIndex0(array, isOdd))

  // timeInLoop('arrayFilterWithIndex1', 1e6, () => arrayFilterWithIndex1(array, isOdd))

  // timeInLoop('arrayFilterWithIndex2', 1e6, () => arrayFilterWithIndex2(array, isOdd))

  // timeInLoop('arrayFilterWithIndex3', 1e6, () => arrayFilterWithIndex3(array, isOdd))

  // timeInLoop('arrayFilterWithIndex30', 1e6, () => arrayFilterWithIndex30(array, isOdd))

  // timeInLoop('arrayFilterWithIndex31', 1e6, () => arrayFilterWithIndex31(array, isOdd))

  // timeInLoop('arrayFilterWithIndex32', 1e6, () => arrayFilterWithIndex32(array, isOdd))

  // timeInLoop('arrayFilterWithIndex33', 1e6, () => arrayFilterWithIndex33(array, isOdd))

  // timeInLoop.async('arrayFilterWithIndex0 - async', 1e5, () => arrayFilterWithIndex0(array, asyncIsOdd))

  // timeInLoop.async('arrayFilterWithIndex1 - async', 1e5, () => arrayFilterWithIndex1(array, asyncIsOdd))

  // timeInLoop.async('arrayFilterWithIndex2 - async', 1e5, () => arrayFilterWithIndex2(array, asyncIsOdd))

  // timeInLoop.async('arrayFilterWithIndex3 - async', 1e5, () => arrayFilterWithIndex3(array, asyncIsOdd))

  // timeInLoop.async('arrayFilterWithIndex30 - async', 1e5, () => arrayFilterWithIndex30(array, asyncIsOdd))

  // timeInLoop.async('arrayFilterWithIndex31 - async', 1e5, () => arrayFilterWithIndex31(array, asyncIsOdd))

  // timeInLoop.async('arrayFilterWithIndex32 - async', 1e5, () => arrayFilterWithIndex32(array, asyncIsOdd))

  // timeInLoop.async('arrayFilterWithIndex33 - async', 1e5, () => arrayFilterWithIndex33(array, asyncIsOdd))
}
