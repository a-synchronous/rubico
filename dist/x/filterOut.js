/**
 * rubico v2.7.9
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2026 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, filterOut) {
  if (typeof module == 'object') (module.exports = filterOut) // CommonJS
  else if (typeof define == 'function') define(() => filterOut) // AMD
  else (root.filterOut = filterOut) // Browser
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

const FilteringAsyncIterator = (asyncIterator, predicate) => ({
  isAsyncIteratorDone: false,
  [symbolAsyncIterator]() {
    return this
  },
  async next() {
    while (!this.isAsyncIteratorDone) {
      const { value, done } = await asyncIterator.next()
      if (done) {
        this.isAsyncIteratorDone = true
      } else {
        const predication = predicate(value)
        if (isPromise(predication) ? await predication : predication) {
          return { value, done: false }
        }
      }
    }
    return { value: undefined, done: true }
  },
})

const isArray = Array.isArray

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
    const element = array[index],
      shouldIncludeElement = predicate(element, index, array)
    if (isPromise(shouldIncludeElement)) {
      return promiseAll(
        arrayExtendMap([shouldIncludeElement], array, predicate, index)
      ).then(curry4(arrayFilterByConditions, array, result, index - 1, __))
    }
    if (shouldIncludeElement) {
      result[++resultIndex] = element
    }
  }
  return result
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

const callPropUnary = (value, property, arg0) => value[property](arg0)

const stringFilter = function (string, predicate) {
  const filteredCharactersArray = arrayFilter(string, predicate)
  return isPromise(filteredCharactersArray)
    ? filteredCharactersArray.then(curry3(callPropUnary, __, 'join', ''))
    : filteredCharactersArray.join('')
}

const always = value => function getter() { return value }

const thunkConditional = (
  conditionalExpression, thunkOnTruthy, thunkOnFalsy,
) => conditionalExpression ? thunkOnTruthy() : thunkOnFalsy()

const thunkify1 = (func, arg0) => function thunk() {
  return func(arg0)
}

const noop = function () {}

const setFilter = function (value, predicate) {
  const result = new Set(),
    resultAdd = result.add.bind(result),
    promises = []
  for (const element of value) {
    const predication = predicate(element, element, value)
    if (isPromise(predication)) {
      promises.push(predication.then(curry3(
        thunkConditional, __, thunkify1(resultAdd, element), noop)))
    } else if (predication) {
      result.add(element)
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
  for (const [key, element] of map) {
    const predication = predicate(element, key, map)
    if (isPromise(predication)) {
      promises.push(predication.then(curry3(thunkConditional,
        __,
        thunkify4(callPropBinary, result, 'set', key, element),
        noop)))
    } else if (predication) {
      result.set(key, element)
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
    const element = object[key],
      shouldIncludeElement = predicate(element, key, object)
    if (isPromise(shouldIncludeElement)) {
      promises.push(shouldIncludeElement.then(
        curry4(objectSetIf, result, key, object[key], __)))
    } else if (shouldIncludeElement) {
      result[key] = element
    }
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(always(result))
}

const _filter = function (value, predicate) {
  if (isArray(value)) {
    return arrayFilter(value, predicate)
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
  if (typeof value[symbolIterator] == 'function') {
    return FilteringIterator(value[symbolIterator](), predicate)
  }
  if (typeof value[symbolAsyncIterator] == 'function') {
    return FilteringAsyncIterator(value[symbolAsyncIterator](), predicate)
  }
  if (value.constructor == Object) {
    return objectFilter(value, predicate)
  }
  return value
}

const filter = function (arg0, arg1) {
  if (typeof arg0 == 'function') {
    return curry2(_filter, __, arg0)
  }
  return isPromise(arg0)
    ? arg0.then(curry2(_filter, __, arg1))
    : _filter(arg0, arg1)
}

const areAnyValuesPromises = function (values) {
  if (isArray(values)) {
    const length = values.length
    let index = -1
    while (++index < length) {
      const value = values[index]
      if (isPromise(value)) {
        return true
      }
    }
    return false
  }

  for (const key in values) {
    const value = values[key]
    if (isPromise(value)) {
      return true
    }
  }
  return false
}

// argument resolver for curryArgs2
const curryArgs2ResolveArgs0 = (
  baseFunc, arg1, arg2,
) => function args0Resolver(...args) {
  return baseFunc(args, arg1)
}

// argument resolver for curryArgs2
const curryArgs2ResolveArgs1 = (
  baseFunc, arg0, arg2,
) => function arg1Resolver(...args) {
  return baseFunc(arg0, args)
}

const curryArgs2 = function (baseFunc, arg0, arg1) {
  if (arg0 == __) {
    return curryArgs2ResolveArgs0(baseFunc, arg1)
  }
  return curryArgs2ResolveArgs1(baseFunc, arg0)
}

// negate(value boolean) -> inverse boolean
const negate = value => !value

// _not(args Array, predicate function)
const _not = function (args, predicate) {
  const boolean = predicate(...args)
  return isPromise(boolean) ? boolean.then(negate) : !boolean
}

const not = function (...args) {
  const predicateOrValue = args.pop()
  if (typeof predicateOrValue == 'function') {
    if (args.length == 0) {
      return curryArgs2(_not, __, predicateOrValue)
    }
    if (areAnyValuesPromises(args)) {
      return promiseAll(args).then(curry2(_not, __, predicateOrValue))
    }
    return _not(args, predicateOrValue)
  }
  return isPromise(predicateOrValue)
    ? predicateOrValue.then(negate)
    : !predicateOrValue
}

const filterOut = predicate => filter(not(predicate))

return filterOut
}())))
