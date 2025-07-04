/**
 * rubico v2.7.7
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2025 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, differenceWith) {
  if (typeof module == 'object') (module.exports = differenceWith) // CommonJS
  else if (typeof define == 'function') define(() => differenceWith) // AMD
  else (root.differenceWith = differenceWith) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'
const __ = Symbol.for('placeholder')

// argument resolver for curry2
const curry2ResolveArg0 = (
  baseFunc, arg1,
) => function arg0Resolver(arg0) {
  return baseFunc(arg0, arg1)
}

// argument resolver for curry2
const curry2ResolveArg1 = (
  baseFunc, arg0,
) => function arg1Resolver(arg1) {
  return baseFunc(arg0, arg1)
}

const curry2 = function (baseFunc, arg0, arg1) {
  return arg0 == __
    ? curry2ResolveArg0(baseFunc, arg1)
    : curry2ResolveArg1(baseFunc, arg0)
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

const thunkify5 = (func, arg0, arg1, arg2, arg3, arg4) => function thunk() {
  return func(arg0, arg1, arg2, arg3, arg4)
}

const thunkConditional = (
  conditionalExpression, thunkOnTruthy, thunkOnFalsy,
) => conditionalExpression ? thunkOnTruthy() : thunkOnFalsy()

const isPromise = value => value != null && typeof value.then == 'function'

const isArray = Array.isArray

const SelfReferencingPromise = function (basePromise) {
  const promise = basePromise.then(res => [res, promise])
  return promise
}

const promiseRace = Promise.race.bind(Promise)

const asyncArraySome = async function (
  array, predicate, index, promisesInFlight,
) {
  const length = array.length

  while (++index < length) {
    const predication = predicate(array[index])
    if (isPromise(predication)) {
      promisesInFlight.add(SelfReferencingPromise(predication))
    } else if (predication) {
      return true
    }
  }
  while (promisesInFlight.size > 0) {
    const [predication, promise] = await promiseRace(promisesInFlight)
    promisesInFlight.delete(promise)
    if (predication) {
      return true
    }
  }
  return false
}

const arraySome = function (array, predicate) {
  const length = array.length
  let index = -1
  while (++index < length) {
    const predication = predicate(array[index])
    if (isPromise(predication)) {
      return asyncArraySome(
        array, predicate, index, new Set([SelfReferencingPromise(predication)]))
    }
    if (predication) {
      return true
    }
  }
  return false
}

const arrayPush = function (array, value) {
  array.push(value)
  return array
}

const funcConcatSync = (
  funcA, funcB,
) => function pipedFunction(...args) {
  return funcB(funcA(...args))
}

const noop = function () {}

const symbolIterator = Symbol.iterator

const symbolAsyncIterator = Symbol.asyncIterator

const differenceWithArrayAsync = async function (
  comparator, allValues, array, result, index
) {
  const allValuesLength = allValues.length
  while (++index < allValuesLength) {
    const element = allValues[index]
    let doesElementExistByComparator = arraySome(array, curry2(comparator, element, __))
    if (isPromise(doesElementExistByComparator)) {
      doesElementExistByComparator = await doesElementExistByComparator
    }
    if (!doesElementExistByComparator) {
      result.push(element)
    }
  }
  return result
}

const differenceWithArray = function (comparator, allValues, array) {
  const allValuesLength = allValues.length,
    result = []
  let index = -1
  while (++index < allValuesLength) {
    const element = allValues[index],
      doesElementExistByComparator = arraySome(array, curry2(comparator, element, __))
    if (isPromise(doesElementExistByComparator)) {
      return doesElementExistByComparator.then(funcConcatSync(
        curry3(thunkConditional, __, noop, thunkify2(arrayPush, result, element)),
        thunkify5(differenceWithArrayAsync, comparator, allValues, array, result, index)))
    } else if (!doesElementExistByComparator) {
      result.push(element)
    }
  }
  return result
}

const differenceWith = (
  comparator, allValues,
) => function excludingValues(values) {
  if (isArray(values)) {
    return differenceWithArray(comparator, allValues, values)
  }
  throw new TypeError(`${values} is not an Array`)
}

return differenceWith
}())))
