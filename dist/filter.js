/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, filter) {
  if (typeof module == 'object') (module.exports = filter) // CommonJS
  else if (typeof define == 'function') define(() => filter) // AMD
  else (root.filter = filter) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const symbolIterator = Symbol.iterator

const FilteringIterator = (iterator, predicate) => ({
  [symbolIterator]() {
    return this
  },
  next() {
    let iteration = iterator.next()
    while (!iteration.done) {
      const { value } = iteration
      if (predicate(value)) {
        return { value, done: false }
      }
      iteration = iterator.next()
    }
    return iteration
  },
})

const isPromise = value => value != null && typeof value.then == 'function'

const symbolAsyncIterator = Symbol.asyncIterator

const FilteringAsyncIterator = (iter, predicate) => ({
  [symbolAsyncIterator]() {
    return this
  },
  async next() {
    let iteration = await iter.next()

    while (!iteration.done) {
      const { value } = iteration,
        predication = predicate(value)
      if (isPromise(predication) ? await predication : predication) {
        return { value, done: false }
      }
      iteration = await iter.next()
    }
    return iteration
  },
})

const isArray = Array.isArray

const objectProto = Object.prototype

const nativeObjectToString = objectProto.toString

const objectToString = value => nativeObjectToString.call(value)

const generatorFunctionTag = '[object GeneratorFunction]'

const isGeneratorFunction = value => objectToString(value) == generatorFunctionTag

const asyncGeneratorFunctionTag = '[object AsyncGeneratorFunction]'

const isAsyncGeneratorFunction = value => objectToString(value) == asyncGeneratorFunctionTag

const __ = Symbol.for('placeholder')

// argument resolver for curry4
const curry4ResolveArg0 = (
  baseFunc, arg1, arg2, arg3,
) => function arg0Resolver(arg0) {
  return baseFunc(arg0, arg1, arg2, arg3)
}

// argument resolver for curry4
const curry4ResolveArg1 = (
  baseFunc, arg0, arg2, arg3,
) => function arg1Resolver(arg1) {
  return baseFunc(arg0, arg1, arg2, arg3)
}

// argument resolver for curry4
const curry4ResolveArg2 = (
  baseFunc, arg0, arg1, arg3,
) => function arg2Resolver(arg2) {
  return baseFunc(arg0, arg1, arg2, arg3)
}

// argument resolver for curry4
const curry4ResolveArg3 = (
  baseFunc, arg0, arg1, arg2,
) => function arg3Resolver(arg3) {
  return baseFunc(arg0, arg1, arg2, arg3)
}

const curry4 = function (baseFunc, arg0, arg1, arg2, arg3) {
  if (arg0 == __) {
    return curry4ResolveArg0(baseFunc, arg1, arg2, arg3)
  }
  if (arg1 == __) {
    return curry4ResolveArg1(baseFunc, arg0, arg2, arg3)
  }
  if (arg2 == __) {
    return curry4ResolveArg2(baseFunc, arg0, arg1, arg3)
  }
  return curry4ResolveArg3(baseFunc, arg0, arg1, arg2)
}

const promiseAll = Promise.all.bind(Promise)

const arrayExtendMap = function (
  array, values, valuesMapper, valuesIndex,
) {
  const valuesLength = values.length
  let arrayIndex = array.length - 1
  while (++valuesIndex < valuesLength) {
    array[++arrayIndex] = valuesMapper(values[valuesIndex], valuesIndex, array)
  }
  return array
}

const arrayFilterByConditions = function (
  array, result, index, conditions,
) {
  const arrayLength = array.length
  let conditionsIndex = -1
  while (++index < arrayLength) {
    if (conditions[++conditionsIndex]) {
      result.push(array[index])
    }
  }
  return result
}

const arrayFilter = function (array, predicate) {
  const arrayLength = array.length,
    result = []
  let index = -1,
    resultIndex = -1
  while (++index < arrayLength) {
    const item = array[index],
      shouldIncludeItem = predicate(item)
    if (isPromise(shouldIncludeItem)) {
      return promiseAll(
        arrayExtendMap(
          [shouldIncludeItem], array, predicate, index)).then(
            curry4(arrayFilterByConditions, array, result, index - 1, __))
    }
    if (shouldIncludeItem) {
      result[++resultIndex] = item
    }
  }
  return result
}

const generatorFunctionFilter = (
  generatorFunction, predicate,
) => function* filteringGeneratorFunction(...args) {
  yield* FilteringIterator(generatorFunction(...args), predicate)
}

const asyncGeneratorFunctionFilter = (
  asyncGeneratorFunction, predicate,
) => async function* filteringAsyncGeneratorFunction(...args) {
  yield* FilteringAsyncIterator(asyncGeneratorFunction(...args), predicate)
}

// argument resolver for curry3
const curry3ResolveArg0 = (
  baseFunc, arg1, arg2,
) => function arg0Resolver(arg0) {
  return baseFunc(arg0, arg1, arg2)
}

// argument resolver for curry3
const curry3ResolveArg1 = (
  baseFunc, arg0, arg2,
) => function arg1Resolver(arg1) {
  return baseFunc(arg0, arg1, arg2)
}

// argument resolver for curry3
const curry3ResolveArg2 = (
  baseFunc, arg0, arg1,
) => function arg2Resolver(arg2) {
  return baseFunc(arg0, arg1, arg2)
}

const curry3 = function (baseFunc, arg0, arg1, arg2) {
  if (arg0 == __) {
    return curry3ResolveArg0(baseFunc, arg1, arg2)
  }
  if (arg1 == __) {
    return curry3ResolveArg1(baseFunc, arg0, arg2)
  }
  return curry3ResolveArg2(baseFunc, arg0, arg1)
}

const thunkify2 = (func, arg0, arg1) => function thunk() {
  return func(arg0, arg1)
}

const thunkConditional = (
  conditionalExpression, thunkOnTruthy, thunkOnFalsy,
) => conditionalExpression ? thunkOnTruthy() : thunkOnFalsy()

const always = value => function getter() { return value }

const reducerFilter = (
  reducer, predicate,
) => function filteringReducer(result, item) {
  const shouldInclude = predicate(item)
  return isPromise(shouldInclude)
    ? shouldInclude.then(curry3(
      thunkConditional,
      __,
      thunkify2(reducer, result, item),
      always(result)))
    : shouldInclude ? reducer(result, item) : result
}

const callPropUnary = (value, property, arg0) => value[property](arg0)

const stringFilter = function (string, predicate) {
  const filteredCharactersArray = arrayFilter(string, predicate)
  return isPromise(filteredCharactersArray)
    ? filteredCharactersArray.then(curry3(callPropUnary, __, 'join', ''))
    : filteredCharactersArray.join('')
}

const thunkify1 = (func, arg0) => function thunk() {
  return func(arg0)
}

const noop = function () {}

const setFilter = function (value, predicate) {
  const result = new Set(),
    resultAdd = result.add.bind(result),
    promises = []
  for (const item of value) {
    const predication = predicate(item, item, value)
    if (isPromise(predication)) {
      promises.push(predication.then(curry3(
        thunkConditional, __, thunkify1(resultAdd, item), noop)))
    } else if (predication) {
      result.add(item)
    }
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(always(result))
}

const thunkify4 = (func, arg0, arg1, arg2, arg3) => function thunk() {
  return func(arg0, arg1, arg2, arg3)
}

const callPropBinary = (value, property, arg0, arg1) => value[property](arg0, arg1)

const mapFilter = function (map, predicate) {
  const result = new Map(),
    promises = []
  for (const [key, item] of map) {
    const predication = predicate(item, key, map)
    if (isPromise(predication)) {
      promises.push(predication.then(curry3(thunkConditional,
        __,
        thunkify4(callPropBinary, result, 'set', key, item),
        noop)))
    } else if (predication) {
      result.set(key, item)
    }
  }
  return promises.length == 0 ? result
    : promiseAll(promises).then(always(result))
}

const objectSetIf = function (
  object, key, value, condition,
) {
  if (condition) {
    object[key] = value
  }
}

const objectFilter = function (object, predicate) {
  const result = {},
    promises = []
  for (const key in object) {
    const item = object[key],
      shouldIncludeItem = predicate(item, key, object)
    if (isPromise(shouldIncludeItem)) {
      promises.push(shouldIncludeItem.then(
        curry4(objectSetIf, result, key, object[key], __)))
    } else if (shouldIncludeItem) {
      result[key] = item
    }
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(always(result))
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

const arrayFilterWithIndex = function (array, predicate) {
  const arrayLength = array.length,
    result = []
  let index = -1,
    resultIndex = -1
  while (++index < arrayLength) {
    const item = array[index],
      shouldIncludeItem = predicate(item, index, array)
    if (isPromise(shouldIncludeItem)) {
      return promiseAll(
        arrayExtendMapWithIndex(
          [shouldIncludeItem], array, predicate, index)).then(
            curry4(arrayFilterByConditions, array, result, index - 1, __))
    }
    if (shouldIncludeItem) {
      result[++resultIndex] = item
    }
  }
  return result
}

const filter = predicate => function filtering(value) {
  if (isArray(value)) {
    return arrayFilter(value, predicate)
  }
  if (typeof value == 'function') {
    if (isGeneratorFunction(value)) {
      return generatorFunctionFilter(value, predicate)
    }
    if (isAsyncGeneratorFunction(value)) {
      return asyncGeneratorFunctionFilter(value, predicate)
    }
    return reducerFilter(value, predicate)
  }
  if (value == null) {
    return value
  }

  if (typeof value == 'string' || value.constructor == String) {
    return stringFilter(value, predicate)
  }
  if (value.constructor == Set) {
    return setFilter(value, predicate)
  }
  if (value.constructor == Map) {
    return mapFilter(value, predicate)
  }
  if (typeof value.filter == 'function') {
    return value.filter(predicate)
  }
  if (value.constructor == Object) {
    return objectFilter(value, predicate)
  }
  if (typeof value[symbolIterator] == 'function') {
    return FilteringIterator(value[symbolIterator](), predicate)
  }
  if (typeof value[symbolAsyncIterator] == 'function') {
    return FilteringAsyncIterator(value[symbolAsyncIterator](), predicate)
  }
  return value
}

filter.withIndex = predicate => function filteringWithIndex(value) {
  if (isArray(value)) {
    return arrayFilterWithIndex(value, predicate)
  }
  throw new TypeError(`${value} is not an Array`)
}

return filter
}())))
