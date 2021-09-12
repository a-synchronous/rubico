/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, forEach) {
  if (typeof module == 'object') (module.exports = forEach) // CommonJS
  else if (typeof define == 'function') define(() => forEach) // AMD
  else (root.forEach = forEach) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const isArray = Array.isArray

const objectProto = Object.prototype

const nativeObjectToString = objectProto.toString

const objectToString = value => nativeObjectToString.call(value)

const generatorFunctionTag = '[object GeneratorFunction]'

const isGeneratorFunction = value => objectToString(value) == generatorFunctionTag

const asyncGeneratorFunctionTag = '[object AsyncGeneratorFunction]'

const isAsyncGeneratorFunction = value => objectToString(value) == asyncGeneratorFunctionTag

const isPromise = value => value != null && typeof value.then == 'function'

const promiseAll = Promise.all.bind(Promise)

const always = value => function getter() { return value }

const arrayForEach = function (array, callback) {
  const length = array.length,
    promises = []
  let index = -1
  while (++index < length) {
    const operation = callback(array[index])
    if (isPromise(operation)) {
      promises.push(operation)
    }
  }
  return promises.length == 0 ? array : promiseAll(promises).then(always(array))
}

const objectForEach = function (object, callback) {
  const promises = []
  for (const key in object) {
    const operation = callback(object[key])
    if (isPromise(operation)) {
      promises.push(operation)
    }
  }
  return promises.length == 0 ? object : promiseAll(promises).then(always(object))
}

const iteratorForEach = function (iterator, callback) {
  const promises = []
  for (const item of iterator) {
    const operation = callback(item)
    if (isPromise(operation)) {
      promises.push(operation)
    }
  }
  return promises.length == 0 ? iterator : promiseAll(promises).then(always(iterator))
}

const asyncIteratorForEach = async function (asyncIterator, callback) {
  const promises = []
  for await (const item of asyncIterator) {
    const operation = callback(item)
    if (isPromise(operation)) {
      promises.push(operation)
    }
  }
  return promises.length == 0 ? asyncIterator
    : promiseAll(promises).then(always(asyncIterator))
}

const generatorFunctionForEach = (
  generatorFunction, callback,
) => function* executingCallbackForEach(...args) {
  const promises = [],
    generator = generatorFunction(...args)
  for (const item of generator) {
    const operation = callback(item)
    if (isPromise(operation)) {
      promises.push(operation)
    }
  }
  return promises.length == 0 ? generator
    : promiseAll(promises).then(always(generator))
}

const asyncGeneratorFunctionForEach = (
  asyncGeneratorFunction, callback,
) => async function* executingCallbackForEach(...args) {
  const promises = [],
    asyncIterator = asyncGeneratorFunction(...args)
  for await (const item of asyncIterator) {
    const operation = callback(item)
    if (isPromise(operation)) {
      promises.push(operation)
    }
  }
  return promises.length == 0 ? asyncIterator
    : promiseAll(promises).then(always(asyncIterator))
}

const thunkify2 = (func, arg0, arg1) => function thunk() {
  return func(arg0, arg1)
}

const reducerForEach = (
  reducer, callback,
) => function executingForEach(result, item) {
  const operation = callback(item)
  if (isPromise(operation)) {
    return operation.then(thunkify2(reducer, result, item))
  }
  return reducer(result, item)
}

const symbolIterator = Symbol.iterator

const symbolAsyncIterator = Symbol.asyncIterator

const forEach = callback => function executingCallbackForEach(value) {
  if (isArray(value)) {
    return arrayForEach(value, callback)
  }
  if (typeof value == 'function') {
    if (isGeneratorFunction(value)) {
      return generatorFunctionForEach(value, callback)
    }
    if (isAsyncGeneratorFunction(value)) {
      return asyncGeneratorFunctionForEach(value, callback)
    }
    return reducerForEach(value, callback)
  }
  if (value == null) {
    return value
  }
  if (typeof value.forEach == 'function') {
    return value.forEach(callback)
  }
  if (typeof value[symbolIterator] == 'function') {
    return iteratorForEach(value[symbolIterator](), callback)
  }
  if (typeof value[symbolAsyncIterator] == 'function') {
    return asyncIteratorForEach(value[symbolAsyncIterator](), callback)
  }
  if (value.constructor == Object) {
    return objectForEach(value, callback)
  }
  return value
}

return forEach
}())))
