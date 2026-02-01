/**
 * rubico v2.7.9
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2026 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, forEach) {
  if (typeof module == 'object') (module.exports = forEach) // CommonJS
  else if (typeof define == 'function') define(() => forEach) // AMD
  else (root.forEach = forEach) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const isPromise = value => value != null && typeof value.then == 'function'

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

const isArray = Array.isArray

const objectProto = Object.prototype

const nativeObjectToString = objectProto.toString

const objectToString = value => nativeObjectToString.call(value)

const generatorFunctionTag = '[object GeneratorFunction]'

const isGeneratorFunction = value => objectToString(value) == generatorFunctionTag

const asyncGeneratorFunctionTag = '[object AsyncGeneratorFunction]'

const isAsyncGeneratorFunction = value => objectToString(value) == asyncGeneratorFunctionTag

const promiseAll = Promise.all.bind(Promise)

const always = value => function getter() { return value }

const arrayForEach = function (array, callback) {
  const length = array.length,
    promises = []
  let index = -1
  while (++index < length) {
    const operation = callback(array[index], index, array)
    if (isPromise(operation)) {
      promises.push(operation)
    }
  }
  return promises.length == 0 ? array : promiseAll(promises).then(always(array))
}

const objectForEach = function (object, callback) {
  const promises = []
  for (const key in object) {
    const operation = callback(object[key], key, object)
    if (isPromise(operation)) {
      promises.push(operation)
    }
  }
  return promises.length == 0 ? object : promiseAll(promises).then(always(object))
}

const iteratorForEach = function (iterator, callback) {
  const promises = []
  for (const element of iterator) {
    const operation = callback(element)
    if (isPromise(operation)) {
      promises.push(operation)
    }
  }
  return promises.length == 0 ? iterator : promiseAll(promises).then(always(iterator))
}

const asyncIteratorForEach = async function (asyncIterator, callback) {
  const promises = []
  for await (const element of asyncIterator) {
    const operation = callback(element)
    if (isPromise(operation)) {
      promises.push(operation)
    }
  }
  return promises.length == 0 ? asyncIterator
    : promiseAll(promises).then(always(asyncIterator))
}

const symbolIterator = Symbol.iterator

const symbolAsyncIterator = Symbol.asyncIterator

const thunkify3 = (func, arg0, arg1, arg2) => function thunk() {
  return func(arg0, arg1, arg2)
}

// _arrayForEachSeriesAsync(
//   array Array,
//   callback function,
//   index number
// ) -> Promise<array>
const _arrayForEachSeriesAsync = async function (array, callback, index) {
  const length = array.length
  while (++index < length) {
    const operation = callback(array[index])
    if (isPromise(operation)) {
      await operation
    }
  }
  return array
}

const arrayForEachSeries = function (array, callback) {
  const length = array.length
  let index = -1
  while (++index < length) {
    const operation = callback(array[index], index, array)
    if (isPromise(operation)) {
      return operation
        .then(thunkify3(_arrayForEachSeriesAsync, array, callback, index))
    }
  }
  return array
}

// _objectForEachSeriesAsync(
//   object Object,
//   callback function,
//   doneKeys Object,
// ) -> Promise<object>
const _objectForEachSeriesAsync = async function (object, callback, doneKeys) {
  for (const key in object) {
    if (key in doneKeys) {
      continue
    }
    const operation = callback(object[key])
    if (isPromise(operation)) {
      await operation
    }
  }
  return object
}

const objectForEachSeries = function (object, callback) {
  const doneKeys = {}
  for (const key in object) {
    doneKeys[key] = true
    const operation = callback(object[key], key, object)
    if (isPromise(operation)) {
      return operation
        .then(thunkify3(_objectForEachSeriesAsync, object, callback, doneKeys))
    }
  }
  return object
}

const thunkify2 = (func, arg0, arg1) => function thunk() {
  return func(arg0, arg1)
}

// _iteratorForEachSeriesAsync(
//   iterator Iterator,
//   callback function,
// ) -> Promise<iterator>
const _iteratorForEachSeriesAsync = async function (iterator, callback) {
  let iteration = iterator.next()
  while (!iteration.done) {
    const operation = callback(iteration.value)
    if (isPromise(operation)) {
      await operation
    }
    iteration = iterator.next()
  }
  return iterator
}

const iteratorForEachSeries = function (iterator, callback) {
  let iteration = iterator.next()
  while (!iterator.done) {
    const operation = callback(iteration.value)
    if (isPromise(operation)) {
      return operation
        .then(thunkify2(_iteratorForEachSeriesAsync, iterator, callback))
    }
    iteration = iterator.next()
  }
  return iterator
}

const asyncIteratorForEachSeries = async function (asyncIterator, callback) {
  for await (const element of asyncIterator) {
    const operation = callback(element)
    if (isPromise(operation)) {
      await operation
    }
  }
  return asyncIterator
}

// type Collection = Array|Iterable|AsyncIterable|{ forEach: function }|Object
// _forEach(collection Collection, callback function) -> collection Collection
const _forEach = function (collection, callback) {
  if (isArray(collection)) {
    return arrayForEach(collection, callback)
  }
  if (collection == null) {
    return collection
  }
  if (typeof collection.forEach == 'function') {
    collection.forEach(callback)
    return collection
  }
  if (typeof collection[symbolIterator] == 'function') {
    return iteratorForEach(collection[symbolIterator](), callback)
  }
  if (typeof collection[symbolAsyncIterator] == 'function') {
    return asyncIteratorForEach(collection[symbolAsyncIterator](), callback)
  }
  if (collection.constructor == Object) {
    return objectForEach(collection, callback)
  }
  return collection
}

const forEach = function (arg0, arg1) {
  if (typeof arg0 == 'function') {
    return curry2(_forEach, __, arg0)
  }
  return isPromise(arg0)
    ? arg0.then(curry2(_forEach, __, arg1))
    : _forEach(arg0, arg1)
}

const _forEachSeries = function (collection, callback) {
  if (isArray(collection)) {
    return arrayForEachSeries(collection, callback)
  }
  if (collection == null) {
    throw new TypeError(`invalid collection ${collection}`)
  }
  if (typeof collection[symbolIterator] == 'function') {
    return iteratorForEachSeries(collection[symbolIterator](), callback)
  }
  if (typeof collection[symbolAsyncIterator] == 'function') {
    return asyncIteratorForEachSeries(collection[symbolAsyncIterator](), callback)
  }
  if (collection.constructor == Object) {
    return objectForEachSeries(collection, callback)
  }
  throw new TypeError(`invalid collection ${collection}`)
}

forEach.series = function forEachSeries(arg0, arg1) {
  if (typeof arg0 == 'function') {
    return curry2(_forEachSeries, __, arg0)
  }
  return isPromise(arg0)
    ? arg0.then(curry2(_forEachSeries, __, arg1))
    : _forEachSeries(arg0, arg1)
}

return forEach
}())))
