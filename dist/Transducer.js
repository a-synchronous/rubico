/**
 * rubico v2.7.9
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2026 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, Transducer) {
  if (typeof module == 'object') (module.exports = Transducer) // CommonJS
  else if (typeof define == 'function') define(() => Transducer) // AMD
  else (root.Transducer = Transducer) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const isPromise = value => value != null && typeof value.then == 'function'

const funcConcat = (
  funcA, funcB,
) => function pipedFunction(...args) {
  const intermediate = funcA(...args)
  return isPromise(intermediate)
    ? intermediate.then(funcB)
    : funcB(intermediate)
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

const reducerMap = (
  reducer, mapper,
) => function mappingReducer(result, reducerElement) {
  const mappingReducerElement = mapper(reducerElement)
  return isPromise(mappingReducerElement)
    ? mappingReducerElement.then(curry2(reducer, result, __))
    : reducer(result, mappingReducerElement)
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
) => function filteringReducer(result, element) {
  const shouldInclude = predicate(element)
  return isPromise(shouldInclude)
    ? shouldInclude.then(curry3(
      thunkConditional,
      __,
      thunkify2(reducer, result, element),
      always(result)))
    : shouldInclude ? reducer(result, element) : result
}

const isArray = Array.isArray

const objectValues = Object.values

const objectProto = Object.prototype

const nativeObjectToString = objectProto.toString

const objectToString = value => nativeObjectToString.call(value)

const generatorFunctionTag = '[object GeneratorFunction]'

const isGeneratorFunction = value => objectToString(value) == generatorFunctionTag

const asyncGeneratorFunctionTag = '[object AsyncGeneratorFunction]'

const isAsyncGeneratorFunction = value => objectToString(value) == asyncGeneratorFunctionTag

const iteratorReduceAsync = async function (
  iterator, reducer, result,
) {
  let iteration = iterator.next()
  if (iteration.done) {
    return result
  }

  while (!iteration.done) {
    result = reducer(result, iteration.value)
    if (isPromise(result)) {
      result = await result
    }
    iteration = iterator.next()
  }
  return result
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
      return result.then(curry3(iteratorReduceAsync, iterator, reducer, __))
    }
    iteration = iterator.next()
  }
  return result
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

const symbolIterator = Symbol.iterator

const symbolAsyncIterator = Symbol.asyncIterator

// argument resolver for curryArgs3
const curryArgs3ResolveArgs0 = (
  baseFunc, arg1, arg2,
) => function args0Resolver(...args) {
  return baseFunc(args, arg1, arg2)
}

// argument resolver for curryArgs3
const curryArgs3ResolveArgs1 = (
  baseFunc, arg0, arg2,
) => function arg1Resolver(...args) {
  return baseFunc(arg0, args, arg2)
}

// argument resolver for curryArgs3
const curryArgs3ResolveArgs2 = (
  baseFunc, arg0, arg1,
) => function arg2Resolver(...args) {
  return baseFunc(arg0, arg1, args)
}

const curryArgs3 = function (baseFunc, arg0, arg1, arg2) {
  if (arg0 == __) {
    return curryArgs3ResolveArgs0(baseFunc, arg1, arg2)
  }
  if (arg1 == __) {
    return curryArgs3ResolveArgs1(baseFunc, arg0, arg2)
  }
  return curryArgs3ResolveArgs2(baseFunc, arg0, arg1)
}

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

const arrayReduceAsync = async function (
  array, reducer, result, index,
) {
  const length = array.length
  while (++index < length) {
    result = reducer(result, array[index], index, array)
    if (isPromise(result)) {
      result = await result
    }
  }
  return result
}

const arrayReduce = function (array, reducer, result) {
  const arrayLength = array.length
  let index = -1
  if (result === undefined) {
    result = array[++index]
  }
  while (++index < arrayLength) {
    result = reducer(result, array[index], index, array)
    if (isPromise(result)) {
      return result.then(curry4(arrayReduceAsync, array, reducer, __, index))
    }
  }
  return result
}

// argument resolver for curry5
const curry5ResolveArg0 = (
  baseFunc, arg1, arg2, arg3, arg4,
) => function arg0Resolver(arg0) {
  return baseFunc(arg0, arg1, arg2, arg3, arg4)
}

// argument resolver for curry5
const curry5ResolveArg1 = (
  baseFunc, arg0, arg2, arg3, arg4,
) => function arg1Resolver(arg1) {
  return baseFunc(arg0, arg1, arg2, arg3, arg4)
}

// argument resolver for curry5
const curry5ResolveArg2 = (
  baseFunc, arg0, arg1, arg3, arg4,
) => function arg2Resolver(arg2) {
  return baseFunc(arg0, arg1, arg2, arg3, arg4)
}

// argument resolver for curry5
const curry5ResolveArg3 = (
  baseFunc, arg0, arg1, arg2, arg4,
) => function arg3Resolver(arg3) {
  return baseFunc(arg0, arg1, arg2, arg3, arg4)
}

// argument resolver for curry5
const curry5ResolveArg4 = (
  baseFunc, arg0, arg1, arg2, arg3,
) => function arg3Resolver(arg4) {
  return baseFunc(arg0, arg1, arg2, arg3, arg4)
}

const curry5 = function (baseFunc, arg0, arg1, arg2, arg3, arg4) {
  if (arg0 == __) {
    return curry5ResolveArg0(baseFunc, arg1, arg2, arg3, arg4)
  }
  if (arg1 == __) {
    return curry5ResolveArg1(baseFunc, arg0, arg2, arg3, arg4)
  }
  if (arg2 == __) {
    return curry5ResolveArg2(baseFunc, arg0, arg1, arg3, arg4)
  }
  if (arg3 == __) {
    return curry5ResolveArg3(baseFunc, arg0, arg1, arg2, arg4)
  }
  return curry5ResolveArg4(baseFunc, arg0, arg1, arg2, arg3)
}

const objectKeys = Object.keys

const objectReduceAsync = async function (object, reducer, result, keys, index) {
  const keysLength = keys.length
  while (++index < keysLength) {
    const key = keys[index]
    result = reducer(result, object[key], key, object)
    if (isPromise(result)) {
      result = await result
    }
  }
  return result
}

const objectReduce = function (object, reducer, result) {
  const keys = objectKeys(object),
    keysLength = keys.length
  let index = -1
  if (result === undefined) {
    result = object[keys[++index]]
  }
  while (++index < keysLength) {
    const key = keys[index]
    result = reducer(result, object[key], key, object)
    if (isPromise(result)) {
      return result.then(curry5(objectReduceAsync, object, reducer, __, keys, index))
    }
  }
  return result
}

const mapReduceAsync = async function (
  map, reducer, result, mapEntriesIter,
) {
  for (const [key, value] of mapEntriesIter) {
    result = reducer(result, value, key, map)
    if (isPromise(result)) {
      result = await result
    }
  }
  return result
}

const mapReduce = function (map, reducer, result) {
  const mapEntriesIter = map.entries()
  if (result === undefined) {
    const firstIteration = mapEntriesIter.next()
    if (firstIteration.done) {
      return result
    }
    result = firstIteration.value[1]
  }
  for (const [key, value] of mapEntriesIter) {
    result = reducer(result, value, key, map)
    if (isPromise(result)) {
      return result.then(curry4(
        mapReduceAsync, map, reducer, __, mapEntriesIter))
    }
  }
  return result
}

const reducerConcat = (
  reducerA, reducerB,
) => function pipedReducer(result, element) {
  const intermediate = reducerA(result, element)
  return isPromise(intermediate)
    ? intermediate.then(curry2(reducerB, __, element))
    : reducerB(intermediate, element)
}

const genericReduce = function (collection, reducer, result) {
  if (isArray(collection)) {
    return arrayReduce(collection, reducer, result)
  }
  if (collection == null) {
    return result === undefined
      ? curry2(reducer, collection, __)
      : reducer(result, collection)
  }

  if (collection.constructor == Map) {
    return mapReduce(collection, reducer, result)
  }
  if (typeof collection[symbolIterator] == 'function') {
    return iteratorReduce(
      collection[symbolIterator](), reducer, result)
  }
  if (typeof collection[symbolAsyncIterator] == 'function') {
    return asyncIteratorReduce(
      collection[symbolAsyncIterator](), reducer, result)
  }
  if (typeof collection.reduce == 'function') {
    return collection.reduce(reducer, result)
  }
  if (typeof collection.chain == 'function') {
    return collection.chain(curry2(reducer, result, __))
  }
  if (typeof collection.flatMap == 'function') {
    return collection.flatMap(curry2(reducer, result, __))
  }
  if (collection.constructor == Object) {
    return objectReduce(collection, reducer, result)
  }
  return result === undefined
    ? curry2(reducer, collection, __)
    : reducer(result, collection)
}

const reducerFlatMap = (
  reducer, flatMapper,
) => function flatMappingReducer(result, value) {
  const monad = flatMapper(value)
  return isPromise(monad)
    ? monad.then(curry3(genericReduce, __, reducer, result))
    : genericReduce(monad, reducer, result)
}

const reducerForEach = (
  reducer, callback,
) => function executingForEach(result, element) {
  const operation = callback(element)
  if (isPromise(operation)) {
    return operation.then(thunkify2(reducer, result, element))
  }
  return reducer(result, element)
}

const _reducerTryCatchErrorHandler = function (
  catcher, reducer, error, accum, element,
) {
  const c = catcher(error, element)
  return isPromise(c) ? c.then(curry2(reducer, accum, __)) : reducer(accum, c)
}

const reducerTryCatch = function (reducer, transducerTryer, catcher) {
  const finalReducer = transducerTryer(reducer)
  return function errorHandlingReducer(accum, element) {
    try {
      const ret = finalReducer(accum, element)
      return isPromise(ret) ? ret.catch(curry5(
        _reducerTryCatchErrorHandler, catcher, reducer, __, accum, element,
      )) : ret
    } catch (error) {
      return _reducerTryCatchErrorHandler(
        catcher, reducer, error, accum, element,
      )
    }
  }
}

const Transducer = {}

Transducer.map = function transducerMap(mapper) {
  return curry2(reducerMap, __, mapper)
}

Transducer.filter = function transducerFilter(predicate) {
  return curry2(reducerFilter, __, predicate)
}

Transducer.flatMap = function transducerFlatMap(flatMapper) {
  return curry2(reducerFlatMap, __, flatMapper)
}

Transducer.forEach = function transducerForEach(func) {
  return curry2(reducerForEach, __, func)
}

Transducer.passthrough = function transducerPassthrough(reducer) {
  return reducer
}

Transducer.tryCatch = function transducerTryCatch(transducerTryer, catcher) {
  return curry3(reducerTryCatch, __, transducerTryer, catcher)
}

return Transducer
}())))
