/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const isPromise = value => value != null && typeof value.then == 'function'

const __ = Symbol.for('placeholder')

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

const isArray = Array.isArray

const isBinary = ArrayBuffer.isView

const callPropUnary = (value, property, arg0) => value[property](arg0)

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

const always = value => function getter() { return value }

const noop = function () {}

const add = (a, b) => a + b

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

const funcConcatSync = (
  funcA, funcB,
) => function pipedFunction(...args) {
  return funcB(funcA(...args))
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

const objectAssign = Object.assign

const isArrayLike = function (value) {
  return value != null && value.length > 0
}

const _arrayExtend = function (array, values) {
  const arrayLength = array.length,
    valuesLength = values.length
  let valuesIndex = -1
  while (++valuesIndex < valuesLength) {
    array[arrayLength + valuesIndex] = values[valuesIndex]
  }
  return array
}

const arrayExtend = function (array, values) {
  if (isArrayLike(values)) {
    return _arrayExtend(array, values)
  }
  array.push(values)
  return array
}

const globalThisHasBuffer = typeof Buffer == 'function'

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

const thunkify1 = (func, arg0) => function thunk() {
  return func(arg0)
}

const isNodeReadStream = value => value != null && typeof value.pipe == 'function'

const __streamWrite = stream => function appender(
  chunk, encoding, callback,
) {
  stream.write(chunk, encoding, callback)
  return stream
}

const _streamExtendExecutor = (
  resultStream, stream,
) => function executor(resolve, reject) {
  stream.on('data', __streamWrite(resultStream))
  stream.on('end', thunkify1(resolve, resultStream))
  stream.on('error', reject)
}

const _streamExtend = (
  resultStream, stream,
) => new Promise(_streamExtendExecutor(resultStream, stream))

const streamExtend = function (stream, values) {
  if (isNodeReadStream(values)) {
    return _streamExtend(stream, values)
  }
  stream.write(values)
  return stream
}

const setExtend = function (set, values) {
  if (values != null && values.constructor == Set) {
    for (const value of values) {
      set.add(value)
    }
    return set
  }
  return set.add(values)
}

const callConcat = function (object, values) {
  return object.concat(values)
}

const identityTransform = function (args, transducer, result) {
  const nil = genericReduce(args, transducer(noop), null)
  return isPromise(nil) ? nil.then(always(result)) : result
}

const genericTransform = function (args, transducer, result) {
  if (isArray(result)) {
    return genericReduce(args, transducer(arrayExtend), result)
  }
  if (isBinary(result)) {
    const intermediateArray = genericReduce(args, transducer(arrayExtend), [])
    return isPromise(intermediateArray)
      ? intermediateArray.then(curry2(binaryExtend, result, __))
      : binaryExtend(result, intermediateArray)
  }
  if (result == null) {
    return identityTransform(args, transducer, result)
  }

  const resultConstructor = result.constructor
  if (typeof result == 'string' || resultConstructor == String) {
    // TODO: use array + join over adding
    return genericReduce(args, transducer(add), result)
  }
  if (typeof result.concat == 'function') {
    return genericReduce(args, transducer(callConcat), result)
  }
  if (typeof result.write == 'function') {
    return genericReduce(args, transducer(streamExtend), result)
  }
  if (resultConstructor == Set) {
    return genericReduce(args, transducer(setExtend), result)
  }
  if (resultConstructor == Object) {
    return genericReduce(args, transducer(objectAssign), result)
  }
  return identityTransform(args, transducer, result)
}

const transform = function (transducer, init) {
  if (typeof init == 'function') {
    return function transforming(...args) {
      const result = init(...args)
      return isPromise(result)
        ? result.then(curry3(genericTransform, args, transducer, __))
        : genericTransform(args, transducer, result)
    }
  }
  return function transforming(...args) {
    return genericTransform(args, transducer, init)
  }
}

export default transform
