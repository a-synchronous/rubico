/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, flatten) {
  if (typeof module == 'object') (module.exports = flatten) // CommonJS
  else if (typeof define == 'function') define(() => flatten) // AMD
  else (root.flatten = flatten) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const isArray = Array.isArray

const __ = Symbol.for('placeholder')

const arrayPush = function (array, value) {
  array.push(value)
  return array
}

const always = value => function getter() { return value }

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

const getArg1 = (arg0, arg1) => arg1

const identity = value => value

const isPromise = value => value != null && typeof value.then == 'function'

const promiseAll = Promise.all.bind(Promise)

const funcConcatSync = (
  funcA, funcB,
) => function pipedFunction(...args) {
  return funcB(funcA(...args))
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

const symbolIterator = Symbol.iterator

const symbolAsyncIterator = Symbol.asyncIterator

const arrayFlatten = function (array) {
  const length = array.length,
    promises = [],
    result = []
  let index = -1

  while (++index < length) {
    const item = array[index]
    if (isArray(item)) {
      const itemLength = item.length
      let itemIndex = -1
      while (++itemIndex < itemLength) {
        result.push(item[itemIndex])
      }
    } else if (item == null) {
      result.push(item)
    } else if (typeof item.then == 'function') {
      promises.push(item.then(curry2(arrayPush, result, __)))
    } else if (typeof item[symbolIterator] == 'function') {
      for (const subItem of item) {
        result.push(subItem)
      }
    } else if (typeof item[symbolAsyncIterator] == 'function') {
      promises.push(asyncIteratorForEach(
        item[symbolAsyncIterator](), curry2(arrayPush, result, __)))
    } else if (typeof item.chain == 'function') {
      const monadValue = item.chain(identity)
      isPromise(monadValue)
        ? promises.push(monadValue.then(curry2(arrayPush, result, __)))
        : result.push(monadValue)
    } else if (typeof item.flatMap == 'function') {
      const monadValue = item.flatMap(identity)
      isPromise(monadValue)
        ? promises.push(monadValue.then(curry2(arrayPush, result, __)))
        : result.push(monadValue)
    } else if (typeof item.reduce == 'function') {
      const folded = item.reduce(funcConcatSync(
        getArg1, curry2(arrayPush, result, __)), null)
      isPromise(folded) && promises.push(folded)
    } else if (item.constructor == Object) {
      for (const key in item) {
        result.push(item[key])
      }
    } else {
      result.push(item)
    }
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(always(result))
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

const setFlatten = function (set) {
  const size = set.size,
    promises = [],
    result = new Set(),
    resultAddReducer = (_, subItem) => result.add(subItem),
    resultAdd = curry3(callPropUnary, result, 'add', __),
    getResult = () => result

  for (const item of set) {
    if (isArray(item)) {
      const itemLength = item.length
      let itemIndex = -1
      while (++itemIndex < itemLength) {
        result.add(item[itemIndex])
      }
    } else if (item == null) {
      result.add(item)
    } else if (typeof item[symbolIterator] == 'function') {
      for (const subItem of item) {
        result.add(subItem)
      }
    } else if (typeof item[symbolAsyncIterator] == 'function') {
      promises.push(
        asyncIteratorForEach(item[symbolAsyncIterator](), resultAdd))
    } else if (typeof item.chain == 'function') {
      const monadValue = item.chain(identity)
      isPromise(monadValue)
        ? promises.push(monadValue.then(resultAdd))
        : result.add(monadValue)
    } else if (typeof item.flatMap == 'function') {
      const monadValue = item.flatMap(identity)
      isPromise(monadValue)
        ? promises.push(monadValue.then(resultAdd))
        : result.add(monadValue)
    } else if (typeof item.reduce == 'function') {
      const folded = item.reduce(resultAddReducer, null)
      isPromise(folded) && promises.push(folded)
    } else if (item.constructor == Object) {
      for (const key in item) {
        result.add(item[key])
      }
    } else {
      result.add(item)
    }
  }
  return promises.length == 0 ? result : promiseAll(promises).then(getResult)
}

const objectAssign = Object.assign

const objectFlatten = function (object) {
  const promises = [],
    result = {},
    resultAssign = curry2(objectAssign, result, __),
    resultAssignReducer = funcConcatSync(getArg1, resultAssign),
    getResult = () => result

  for (const key in object) {
    const item = object[key]
    if (item == null) {
      continue
    } else if (typeof item[symbolIterator] == 'function') {
      for (const monadItem of item) {
        objectAssign(result, monadItem)
      }
    } else if (typeof item[symbolAsyncIterator] == 'function') {
      promises.push(
        asyncIteratorForEach(item[symbolAsyncIterator](), resultAssign))
    } else if (typeof item.chain == 'function') {
      const monadValue = item.chain(identity)
      isPromise(monadValue)
        ? promises.push(monadValue.then(resultAssign))
        : objectAssign(result, monadValue)
    } else if (typeof item.flatMap == 'function') {
      const monadValue = item.flatMap(identity)
      isPromise(monadValue)
        ? promises.push(monadValue.then(resultAssign))
        : resultAssign(monadValue)
    } else if (typeof item.reduce == 'function') {
      const folded = item.reduce(resultAssignReducer, null)
      isPromise(folded) && promises.push(folded)
    } else {
      objectAssign(result, item)
    }
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(getResult)
}

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

const objectGetFirstKey = function (object) {
  for (const key in object) {
    return key
  }
  return undefined
}

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

const generatorFunctionReduce = (
  generatorFunction, reducer, result,
) => funcConcatSync(
  generatorFunction,
  curry3(iteratorReduce, __, reducer, result))

const asyncGeneratorFunctionReduce = (
  asyncGeneratorFunction, reducer, result,
) => funcConcatSync(
  asyncGeneratorFunction,
  curry3(asyncIteratorReduce, __, reducer, result))

const reducerConcat = (
  reducerA, reducerB,
) => function pipedReducer(result, item) {
  const intermediate = reducerA(result, item)
  return isPromise(intermediate)
    ? intermediate.then(curry2(reducerB, __, item))
    : reducerB(intermediate, item)
}

const genericReduce = function (args, reducer, result) {
  const collection = args[0]
  if (isArray(collection)) {
    return arrayReduce(collection, reducer, result)
  }
  if (typeof collection == 'function') {
    if (isGeneratorFunction(collection)) {
      return generatorFunctionReduce(collection, reducer, result)
    }
    if (isAsyncGeneratorFunction(collection)) {
      return asyncGeneratorFunctionReduce(collection, reducer, result)
    }
    return curryArgs3(
      genericReduce,
      __,
      args.length == 1
        ? reducerConcat(reducer, collection)
        : args.reduce(reducerConcat, reducer),
      result)
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

const FlatMappingIterator = function (iterator, flatMapper) {
  let buffer = [],
    bufferIndex = 0
  return {
    [symbolIterator]() {
      return this
    },
    next() {
      if (bufferIndex < buffer.length) {
        const value = buffer[bufferIndex]
        bufferIndex += 1
        return { value, done: false }
      }

      const iteration = iterator.next()
      if (iteration.done) {
        return iteration
      }
      const monadAsArray = genericReduce(
        [flatMapper(iteration.value)],
        arrayPush,
        []) // this will always have at least one item
      if (monadAsArray.length > 1) {
        buffer = monadAsArray
        bufferIndex = 1
      }
      return {
        value: monadAsArray[0],
        done: false,
      }
    },
  }
}

const FlatMappingAsyncIterator = function (asyncIterator, flatMapper) {
  const buffer = [],
    promises = new Set()

  return {
    [symbolAsyncIterator]() {
      return this
    },
    toString() {
      return '[object FlatMappingAsyncIterator]'
    },

    
    async next() {
      if (buffer.length > 0) {
        return { value: buffer.shift(), done: false }
      }
      const { value, done } = await asyncIterator.next()
      if (done) {
        while (promises.size > 0) {
          await new Promise(resolve => setTimeout(resolve, 25))
          if (buffer.length > 0) {
            return { value: buffer.shift(), done: false }
          }
        }
        return { value: undefined, done: true }
      }

      const monad = flatMapper(value)
      if (isPromise(monad)) {
        const bufferLoading = monad.then(
          curryArgs3(genericReduce, __, arrayPush, buffer))
        const promise = bufferLoading.then(() => promises.delete(promise))
        promises.add(promise)
      } else {
        const bufferLoading = genericReduce([monad], arrayPush, buffer)
        if (buffer.length > 0) {
          return { value: buffer.shift(), done: false }
        }
        if (isPromise(bufferLoading)) {
          const promise = bufferLoading.then(() => promises.delete(promise))
          promises.add(promise)
        }
      }

      while (promises.size > 0) {
        await new Promise(resolve => setTimeout(resolve, 25))
        if (buffer.length > 0) {
          return { value: buffer.shift(), done: false }
        }
      }
      return { value: undefined, done: true }
    },
  }
}

const isBinary = ArrayBuffer.isView

const arrayMap = function (array, mapper) {
  const arrayLength = array.length,
    result = Array(arrayLength)
  let index = -1,
    isAsync = false

  while (++index < arrayLength) {
    const resultItem = mapper(array[index], index, array)
    if (isPromise(resultItem)) {
      isAsync = true
    }
    result[index] = resultItem
  }
  return isAsync ? promiseAll(result) : result
}

const arrayFlatMap = function (array, flatMapper) {
  const monadArray = arrayMap(array, flatMapper)
  return isPromise(monadArray)
    ? monadArray.then(arrayFlatten)
    : arrayFlatten(monadArray)
}

const promiseObjectAllExecutor = object => function executor(resolve) {
  const result = {}
  let numPromises = 0
  for (const key in object) {
    const value = object[key]
    if (isPromise(value)) {
      numPromises += 1
      value.then((key => function (res) {
        result[key] = res
        numPromises -= 1
        if (numPromises == 0) {
          resolve(result)
        }
      })(key))
    } else {
      result[key] = value
    }
  }
  if (numPromises == 0) {
    resolve(result)
  }
}

const promiseObjectAll = object => new Promise(promiseObjectAllExecutor(object))

const objectMap = function (object, mapper) {
  const result = {}
  let isAsync = false
  for (const key in object) {
    const resultItem = mapper(object[key], key, object)
    if (isPromise(resultItem)) {
      isAsync = true
    }
    result[key] = resultItem
  }
  return isAsync ? promiseObjectAll(result) : result
}

const objectFlatMap = function (object, flatMapper) {
  const monadObject = objectMap(object, flatMapper)
  return isPromise(monadObject)
    ? monadObject.then(objectFlatten)
    : objectFlatten(monadObject)
}

const setMap = function (set, mapper) {
  const result = new Set(),
    promises = []
  for (const item of set) {
    const resultItem = mapper(item, item, set)
    if (isPromise(resultItem)) {
      promises.push(resultItem.then(curry3(callPropUnary, result, 'add', __)))
    } else {
      result.add(resultItem)
    }
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(always(result))
}

const setFlatMap = function (set, flatMapper) {
  const monadSet = setMap(set, flatMapper)
  return isPromise(monadSet)
    ? monadSet.then(setFlatten)
    : setFlatten(monadSet)
}

const funcConcat = (
  funcA, funcB,
) => function pipedFunction(...args) {
  const intermediate = funcA(...args)
  return isPromise(intermediate)
    ? intermediate.then(funcB)
    : funcB(intermediate)
}

const arrayJoin = (array, delimiter) => array.join(delimiter)

const arrayFlattenToString = funcConcat(
  arrayFlatten,
  curry2(arrayJoin, __, ''))

const stringFlatMap = function (string, flatMapper) {
  const monadArray = arrayMap(string, flatMapper)
  return isPromise(monadArray)
    ? monadArray.then(arrayFlattenToString)
    : arrayFlattenToString(monadArray)
}

const streamWrite = function (stream, chunk, encoding, callback) {
  stream.write(chunk, encoding, callback)
  return stream
}

const streamFlatExtend = async function (stream, item) {
  const resultStreamWrite = curry2(streamWrite, stream, __),
    // resultStreamWriteReducer = (_, subItem) => stream.write(subItem),
    resultStreamWriteReducer = funcConcatSync(getArg1, resultStreamWrite),
    promises = []
  if (isArray(item)) {
    const itemLength = item.length
    let itemIndex = -1
    while (++itemIndex < itemLength) {
      stream.write(item[itemIndex])
    }
  } else if (item == null) {
    stream.write(item)
  } else if (typeof item[symbolIterator] == 'function') {
    for (const subItem of item) {
      stream.write(subItem)
    }
  } else if (typeof item[symbolAsyncIterator] == 'function') {
    promises.push(
      asyncIteratorForEach(item[symbolAsyncIterator](), resultStreamWrite))
  } else if (typeof item.chain == 'function') {
    const monadValue = item.chain(identity)
    isPromise(monadValue)
      ? promises.push(monadValue.then(resultStreamWrite))
      : stream.write(monadValue)
  } else if (typeof item.flatMap == 'function') {
    const monadValue = item.flatMap(identity)
    isPromise(monadValue)
      ? promises.push(monadValue.then(resultStreamWrite))
      : stream.write(monadValue)
  } else if (typeof item.reduce == 'function') {
    const folded = item.reduce(resultStreamWriteReducer, null)
    isPromise(folded) && promises.push(folded)
  } else if (item.constructor == Object) {
    for (const key in item) {
      stream.write(item[key])
    }
  } else {
    stream.write(item)
  }
  return promises.length == 0
    ? stream
    : promiseAll(promises).then(always(stream))
}

const streamFlatMap = async function (stream, flatMapper) {
  const promises = new Set()
  for await (const item of stream) {
    const monad = flatMapper(item)
    if (isPromise(monad)) {
      const selfDeletingPromise = monad.then(
        curry2(streamFlatExtend, stream, __)).then(
          () => promises.delete(selfDeletingPromise))
      promises.add(selfDeletingPromise)
    } else {
      const streamFlatteningOperation = streamFlatExtend(stream, monad)
      if (isPromise(streamFlatteningOperation)) {
        const selfDeletingPromise = streamFlatteningOperation.then(
          () => promises.delete(selfDeletingPromise))
        promises.add(selfDeletingPromise)
      }
    }
  }
  await promiseAll(promises)
  return stream
}

const globalThisHasBuffer = typeof Buffer == 'function'

const noop = function () {}

const bufferAlloc = globalThisHasBuffer ? Buffer.alloc : noop

const _binaryExtend = function (typedArray, array) {
  const offset = typedArray.length
  const result = globalThisHasBuffer && typedArray.constructor == Buffer
    ? bufferAlloc(offset + array.length)
    : new typedArray.constructor(offset + array.length)
  result.set(typedArray)
  result.set(array, offset)
  return result
}

const binaryExtend = function (typedArray, array) {
  if (isArray(array) || isBinary(array)) {
    return _binaryExtend(typedArray, array)
  }
  return _binaryExtend(typedArray, [array])
}

const arrayJoinToBinary = function (array, init) {
  const length = array.length
  let index = -1,
    result = init
  while (++index < length) {
    result = binaryExtend(result, array[index])
  }
  return result
}

const arrayFlattenToBinary = function (array, result) {
  const flattened = arrayFlatten(array)
  return isPromise(flattened)
    ? flattened.then(curry2(arrayJoinToBinary, __, result))
    : arrayJoinToBinary(flattened, result)
}

const binaryFlatMap = function (binary, flatMapper) {
  const monadArray = arrayMap(binary, flatMapper),
    result = globalThisHasBuffer && binary.constructor == Buffer
      ? bufferAlloc(0)
      : new binary.constructor(0)
  return isPromise(monadArray)
    ? monadArray.then(curry2(arrayFlattenToBinary, __, result))
    : arrayFlattenToBinary(monadArray, result)
}

const reducerFlatMap = (
  reducer, flatMapper,
) => function flatMappingReducer(result, value) {
  const monad = flatMapper(value)
  return isPromise(monad)
    ? monad.then(curryArgs3(genericReduce, __, reducer, result))
    : genericReduce([monad], reducer, result)
}

const generatorFunctionFlatMap = (
  generatorFunction, flatMapper,
) => function* flatMappingGeneratorFunction(...args) {
  yield* FlatMappingIterator(generatorFunction(...args), flatMapper)
}

const asyncGeneratorFunctionFlatMap = (
  asyncGeneratorFunction, flatMapper,
) => async function* flatMappingAsyncGeneratorFunction(...args) {
  yield* FlatMappingAsyncIterator(asyncGeneratorFunction(...args), flatMapper)
}

const flatMap = flatMapper => function flatMapping(value) {
  if (isArray(value)) {
    return arrayFlatMap(value, flatMapper)
  }
  if (typeof value == 'function') {
    if (isGeneratorFunction(value)) {
      return generatorFunctionFlatMap(value, flatMapper)
    }
    if (isAsyncGeneratorFunction(value)) {
      return asyncGeneratorFunctionFlatMap(value, flatMapper)
    }
    return reducerFlatMap(value, flatMapper)
  }
  if (isBinary(value)) {
    return binaryFlatMap(value, flatMapper)
  }
  if (value == null) {
    return flatMapper(value)
  }

  if (typeof value.then == 'function') {
    return value.then(flatMapper)
  }
  if (typeof value.next == 'function') {
    return symbolIterator in value
      ? FlatMappingIterator(value, flatMapper)
      : FlatMappingAsyncIterator(value, flatMapper)
  }
  if (typeof value.chain == 'function') {
    return value.chain(flatMapper)
  }
  if (typeof value.flatMap == 'function') {
    return value.flatMap(flatMapper)
  }
  if (
    typeof value[symbolAsyncIterator] == 'function'
      && typeof value.write == 'function'
  ) {
    return streamFlatMap(value, flatMapper)
  }
  const valueConstructor = value.constructor
  if (valueConstructor == Object) {
    return objectFlatMap(value, flatMapper)
  }
  if (valueConstructor == Set) {
    return setFlatMap(value, flatMapper)
  }
  if (typeof value == 'string' || valueConstructor == String) {
    return stringFlatMap(value, flatMapper)
  }
  return flatMapper(value)
}

const flatten = function (value) {
  if (isArray(value)) {
    return arrayFlatten(value)
  }
  if (value == null) {
    return value
  }
  if (value.constructor == Set) {
    return setFlatten(value)
  }
  if (value.constructor == Object) {
    return objectFlatten(value)
  }
  return flatMap(identity)(value)
}

return flatten
}())))
