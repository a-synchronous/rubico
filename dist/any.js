/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, any) {
  if (typeof module == 'object') (module.exports = any) // CommonJS
  else if (typeof define == 'function') define(() => any) // AMD
  else (root.any = any) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const isArray = Array.isArray

const objectValues = Object.values

const SelfReferencingPromise = function (basePromise) {
  const promise = basePromise.then(res => [res, promise])
  return promise
}

const isPromise = value => value != null && typeof value.then == 'function'

const promiseRace = Promise.race.bind(Promise)

const asyncArrayAny = async function (
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

const arrayAny = function (array, predicate) {
  const length = array.length
  let index = -1
  while (++index < length) {
    const predication = predicate(array[index])
    if (isPromise(predication)) {
      return asyncArrayAny(
        array, predicate, index, new Set([SelfReferencingPromise(predication)]))
    }
    if (predication) {
      return true
    }
  }
  return false
}

const asyncIteratorAny = async function (
  iterator, predicate, promisesInFlight, maxConcurrency = 20,
) {
  let iteration = iterator.next()
  if (isPromise(iteration)) {
    iteration = await iteration
  }

  while (!iteration.done) {
    if (promisesInFlight.size >= maxConcurrency) {
      const [predication, promise] = await promiseRace(promisesInFlight)
      promisesInFlight.delete(promise)
      if (predication) {
        return true
      }
    }
    const predication = predicate(iteration.value)
    if (isPromise(predication)) {
      promisesInFlight.add(SelfReferencingPromise(predication))
    } else if (predication) {
      return true
    }
    iteration = iterator.next()
    if (isPromise(iteration)) {
      iteration = await iteration
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

const iteratorAny = function (iterator, predicate) {
  for (const item of iterator) {
    const predication = predicate(item)
    if (isPromise(predication)) {
      return asyncIteratorAny(
        iterator, predicate, new Set([SelfReferencingPromise(predication)]))
    }
    if (predication) {
      return true
    }
  }
  return false
}

const reducerAnySync = predicate => function anyReducer(result, item) {
  return result ? true : predicate(item)
}

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

const reducerAny = predicate => function anyReducer(result, item) {
  return result === true ? result
    : isPromise(result) ? result.then(curry2(reducerAnySync(predicate), __, item))
    : result ? true : predicate(item)
}

const symbolIterator = Symbol.iterator

const symbolAsyncIterator = Symbol.asyncIterator

const any = predicate => function anyTruthy(value) {
  if (isArray(value)) {
    return arrayAny(value, predicate)
  }
  if (value == null) {
    return predicate(value)
  }
  if (typeof value[symbolIterator] == 'function') {
    return iteratorAny(value[symbolIterator](), predicate)
  }
  if (typeof value[symbolAsyncIterator] == 'function') {
    return asyncIteratorAny(value[symbolAsyncIterator](), predicate, new Set())
  }
  if (typeof value.reduce == 'function') {
    return value.reduce(reducerAny(predicate), false)
  }
  if (value.constructor == Object) {
    return arrayAny(objectValues(value), predicate)
  }
  return predicate(value)
}

return any
}())))
