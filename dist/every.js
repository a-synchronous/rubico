/**
 * rubico v2.7.9
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2026 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, every) {
  if (typeof module == 'object') (module.exports = every) // CommonJS
  else if (typeof define == 'function') define(() => every) // AMD
  else (root.every = every) // Browser
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

const promiseAll = Promise.all.bind(Promise)

const callPropUnary = (value, property, arg0) => value[property](arg0)

const arrayEvery = function (array, predicate) {
  const arrayLength = array.length,
    promises = []
  let index = -1
  while (++index < arrayLength) {
    const predication = predicate(array[index])
    if (isPromise(predication)) {
      promises.push(predication)
    } else if (!predication) {
      return false
    }
  }
  return promises.length == 0
    ? true
    : promiseAll(promises).then(curry3(callPropUnary, __, 'every', Boolean))
}

const iteratorEvery = function (iterator, predicate) {
  const promises = []
  for (const element of iterator) {
    const predication = predicate(element)
    if (isPromise(predication)) {
      promises.push(predication)
    } else if (!predication) {
      return false
    }
  }
  return promises.length == 0
    ? true
    : promiseAll(promises).then(curry3(callPropUnary, __, 'every', Boolean))
}

const SelfReferencingPromise = function (basePromise) {
  const promise = basePromise.then(res => [res, promise])
  return promise
}

const promiseRace = Promise.race.bind(Promise)

const asyncIteratorEvery = async function (
  asyncIterator, predicate, promisesInFlight, maxConcurrency = 20,
) {
  let iteration = await asyncIterator.next()
  while (!iteration.done) {
    if (promisesInFlight.size >= maxConcurrency) {
      const [predication, promise] = await promiseRace(promisesInFlight)
      promisesInFlight.delete(promise)
      if (!predication) {
        return false
      }
    }

    const predication = predicate(iteration.value)
    if (isPromise(predication)) {
      promisesInFlight.add(SelfReferencingPromise(predication))
    } else if (!predication) {
      return false
    }
    iteration = await asyncIterator.next()
  }
  while (promisesInFlight.size > 0) {
    const [predication, promise] = await promiseRace(promisesInFlight)
    promisesInFlight.delete(promise)
    if (!predication) {
      return false
    }
  }
  return true
}

const objectValues = Object.values

const reducerAllSync = (predicate, result, element) => result ? predicate(element) : false

const reducerEvery = predicate => function allReducer(result, element) {
  return result === false ? false
    : isPromise(result) ? result.then(
      curry3(reducerAllSync, predicate, __, element))
    : result ? predicate(element) : false
}

const symbolIterator = Symbol.iterator

const symbolAsyncIterator = Symbol.asyncIterator

// _every(collection Array|Iterable|AsyncIterable|{ reduce: function }|Object, predicate function) -> Promise|boolean
const _every = function (collection, predicate) {
  if (isArray(collection)) {
    return arrayEvery(collection, predicate)
  }
  if (collection == null) {
    return predicate(collection)
  }

  if (typeof collection[symbolIterator] == 'function') {
    return iteratorEvery(collection[symbolIterator](), predicate)
  }
  if (typeof collection[symbolAsyncIterator] == 'function') {
    return asyncIteratorEvery(
      collection[symbolAsyncIterator](), predicate, new Set()
    )
  }
  if (typeof collection.reduce == 'function') {
    return collection.reduce(reducerEvery(predicate), true)
  }
  if (collection.constructor == Object) {
    return arrayEvery(objectValues(collection), predicate)
  }
  return predicate(collection)
}

const every = function (arg0, arg1) {
  if (typeof arg0 == 'function') {
    return curry2(_every, __, arg0)
  }
  return isPromise(arg0)
    ? arg0.then(curry2(_every, __, arg1))
    : _every(arg0, arg1)
}

return every
}())))
