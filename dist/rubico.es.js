/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const noop = function () {}

const isPromise = value => value != null && typeof value.then == 'function'

const funcConcat = (
  funcA, funcB,
) => function pipedFunction(...args) {
  const intermediate = funcA(...args)
  return isPromise(intermediate)
    ? intermediate.then(funcB)
    : funcB(intermediate)
}

const funcConcatSync = (
  funcA, funcB,
) => function pipedFunction(...args) {
  return funcB(funcA(...args))
}

const objectProto = Object.prototype

const nativeObjectToString = objectProto.toString

const objectToString = value => nativeObjectToString.call(value)

const generatorFunctionTag = '[object GeneratorFunction]'

const isGeneratorFunction = value => objectToString(value) == generatorFunctionTag

const asyncGeneratorFunctionTag = '[object AsyncGeneratorFunction]'

const isAsyncGeneratorFunction = value => objectToString(value) == asyncGeneratorFunctionTag

const pipe = function (funcs) {
  let functionPipeline = noop,
    functionComposition = noop
  return function pipeline(...args) {
    const firstArg = args[0]
    if (
      typeof firstArg == 'function'
        && !isGeneratorFunction(firstArg)
        && !isAsyncGeneratorFunction(firstArg)
    ) {
      if (functionComposition == noop) {
        functionComposition = funcs.reduceRight(funcConcat)
      }
      return functionComposition(...args)
    }
      if (functionPipeline == noop) {
        functionPipeline = funcs.reduce(funcConcat)
      }
    return functionPipeline(...args)
  }
}

// funcs Array<function> -> pipeline function
const pipeSync = funcs => funcs.reduce(funcConcatSync)

pipe.sync = pipeSync

const isArray = Array.isArray

const promiseAll = Promise.all.bind(Promise)

const funcAll = funcs => function allFuncs(...args) {
  const funcsLength = funcs.length,
    result = Array(funcsLength)
  let funcsIndex = -1, isAsync = false
  while (++funcsIndex < funcsLength) {
    const resultItem = funcs[funcsIndex](...args)
    if (isPromise(resultItem)) {
      isAsync = true
    }
    result[funcsIndex] = resultItem
  }
  return isAsync ? promiseAll(result) : result
}

const always = value => function getter() { return value }

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

const objectSet = function (object, property, value) {
  object[property] = value
  return object
}

const funcObjectAll = funcs => function objectAllFuncs(...args) {
  const result = {}, promises = []
  for (const key in funcs) {
    const resultItem = funcs[key](...args)
    if (isPromise(resultItem)) {
      promises.push(resultItem.then(curry3(objectSet, result, key, __)))
    } else {
      result[key] = resultItem
    }
  }
  return promises.length == 0 ? result : promiseAll(promises).then(always(result))
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

const asyncFuncAllSeries = async function (funcs, args, result, funcsIndex) {
  const funcsLength = funcs.length
  while (++funcsIndex < funcsLength) {
    const resultItem = funcs[funcsIndex](...args)
    result[funcsIndex] = isPromise(resultItem) ? await resultItem : resultItem
  }
  return result
}

const funcAllSeries = funcs => function allFuncsSeries(...args) {
  const funcsLength = funcs.length, result = []
  let funcsIndex = -1
  while (++funcsIndex < funcsLength) {
    const resultItem = funcs[funcsIndex](...args)
    if (isPromise(resultItem)) {
      return resultItem.then(funcConcat(
        curry3(objectSet, result, funcsIndex, __),
        curry4(asyncFuncAllSeries, funcs, args, __, funcsIndex)))
    }
    result[funcsIndex] = resultItem
  }
  return result
}

const fork = funcs => isArray(funcs) ? funcAll(funcs) : funcObjectAll(funcs)

fork.series = funcs => isArray(funcs) ? funcAllSeries(funcs) : funcObjectAll(funcs)

const objectAssign = Object.assign

const assign = function (funcs) {
  const allFuncs = funcObjectAll(funcs)
  return function assignment(value) {
    const result = allFuncs(value)
    return isPromise(result)
      ? result.then(curry3(objectAssign, {}, value, __))
      : ({ ...value, ...result })
  }
}

const tapSync = func => function tapping(...args) {
  func(...args)
  return args[0]
}

const thunkifyArgs = (func, args) => function thunk() {
  return func(...args)
}

const thunkConditional = (
  conditionalExpression, thunkOnTruthy, thunkOnFalsy,
) => conditionalExpression ? thunkOnTruthy() : thunkOnFalsy()

const tap = func => function tapping(...args) {
  const result = args[0],
    call = func(...args)
  return isPromise(call) ? call.then(always(result)) : result
}

tap.sync = tapSync

tap.if = (predicate, func) => function tappingIf(...args) {
  const predication = predicate(...args)
  if (isPromise(predication)) {
    return predication.then(curry3(
      thunkConditional, __, thunkifyArgs(tap(func), args), always(args[0])))
  }
  if (predication) {
    const execution = func(...args)
    if (isPromise(execution)) {
      return execution.then(always(args[0]))
    }
  }
  return args[0]
}

const catcherApply = function (catcher, err, args) {
  return catcher(err, ...args)
}

const tryCatch = (tryer, catcher) => function tryCatcher(...args) {
  try {
    const result = tryer(...args)
    return isPromise(result)
      ? result.catch(curry3(catcherApply, catcher, __, args))
      : result
  } catch (err) {
    return catcher(err, ...args)
  }
}

const thunkify3 = (func, arg0, arg1, arg2) => function thunk() {
  return func(arg0, arg1, arg2)
}

const funcConditional = function (funcs, args, funcsIndex) {
  const lastIndex = funcs.length - 1
  while ((funcsIndex += 2) < lastIndex) {
    const predicate = funcs[funcsIndex],
      resolver = funcs[funcsIndex + 1],
      predication = predicate(...args)

    if (isPromise(predication)) {
      return predication.then(curry3(
        thunkConditional,
        __,
        thunkifyArgs(resolver, args),
        thunkify3(funcConditional, funcs, args, funcsIndex)))
    }
    if (predication) {
      return resolver(...args)
    }
  }
  return funcs[funcsIndex](...args)
}

const switchCase = funcs => function switchingCases(...args) {
  return funcConditional(funcs, args, -2)
}

const symbolIterator = Symbol.iterator

const MappingIterator = (iterator, mapper) => ({
  toString() {
    return '[object MappingIterator]'
  },
  [symbolIterator]() {
    return this
  },
  next() {
    const iteration = iterator.next()
    return iteration.done ? iteration
      : { value: mapper(iteration.value), done: false }
  },
})

const NextIteration = value => ({ value, done: false })

const symbolAsyncIterator = Symbol.asyncIterator

const MappingAsyncIterator = (asyncIterator, mapper) => ({
  [symbolAsyncIterator]() {
    return this
  },
  async next() {
    const iteration = await asyncIterator.next()
    if (iteration.done) {
      return iteration
    }
    const mapped = mapper(iteration.value)
    return isPromise(mapped)
      ? mapped.then(NextIteration)
      : { value: mapped, done: false }
  }
})

const isObject = value => {
  if (value == null) {
    return false
  }

  const typeofValue = typeof value
  return (typeofValue == 'object') || (typeofValue == 'function')
}

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

const generatorFunctionMap = (
  generatorFunc, mapper,
) => function* mappingGeneratorFunc(...args) {
  for (const item of generatorFunc(...args)) {
    yield mapper(item)
  }
}

const asyncGeneratorFunctionMap = function (asyncGeneratorFunc, mapper) {
  return async function* mappingAsyncGeneratorFunc(...args) {
    for await (const item of asyncGeneratorFunc(...args)) {
      yield mapper(item)
    }
  }
}

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
) => function mappingReducer(result, reducerItem) {
  const mappingReducerItem = mapper(reducerItem)
  return isPromise(mappingReducerItem)
    ? mappingReducerItem.then(curry2(reducer, result, __))
    : reducer(result, mappingReducerItem)
}

const callPropUnary = (value, property, arg0) => value[property](arg0)

const stringMap = function (string, mapper) {
  const result = arrayMap(string, mapper)
  return isPromise(result)
    ? result.then(curry3(callPropUnary, __, 'join', ''))
    : result.join('')
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

const callPropBinary = (value, property, arg0, arg1) => value[property](arg0, arg1)

const mapMap = function (value, mapper) {
  const result = new Map(),
    promises = []
  for (const [key, item] of value) {
    const resultItem = mapper(item, key, value)
    if (isPromise(resultItem)) {
      promises.push(resultItem.then(
        curry4(callPropBinary, result, 'set', key, __)))
    } else {
      result.set(key, resultItem)
    }
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(always(result))
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

const arrayMapSeriesAsync = async function (
  array, mapper, result, index,
) {
  const arrayLength = array.length
  while (++index < arrayLength) {
    const resultItem = mapper(array[index])
    result[index] = isPromise(resultItem) ? await resultItem : resultItem
  }
  return result
}

const arrayMapSeries = function (array, mapper) {
  const arrayLength = array.length,
    result = Array(arrayLength)
  let index = -1

  while (++index < arrayLength) {
    const resultItem = mapper(array[index])
    if (isPromise(resultItem)) {
      return resultItem.then(funcConcat(
        curry3(objectSet, result, index, __),
        curry4(arrayMapSeriesAsync, array, mapper, __, index)))
    }
    result[index] = resultItem
  }
  return result
}

const promiseRace = Promise.race.bind(Promise)

const arrayMapPoolAsync = async function (
  array, mapper, concurrencyLimit, result, index, promises,
) {
  const arrayLength = array.length
  while (++index < arrayLength) {
    if (promises.size >= concurrencyLimit) {
      await promiseRace(promises)
    }

    const resultItem = mapper(array[index])
    if (isPromise(resultItem)) {
      const selfDeletingPromise = resultItem.then(
        tapSync(() => promises.delete(selfDeletingPromise)))
      promises.add(selfDeletingPromise)
      result[index] = selfDeletingPromise
    } else {
      result[index] = resultItem
    }
  }
  return promiseAll(result)
}

const arrayMapPool = function (array, mapper, concurrentLimit) {
  const arrayLength = array.length,
    result = Array(arrayLength)
  let index = -1
  while (++index < arrayLength) {

    const resultItem = mapper(array[index])
    if (isPromise(resultItem)) {
      const promises = new Set(),
        selfDeletingPromise = resultItem.then(
          tapSync(() => promises.delete(selfDeletingPromise)))
      promises.add(selfDeletingPromise)
      result[index] = selfDeletingPromise
      return arrayMapPoolAsync(
        array, mapper, concurrentLimit, result, index, promises)
    }
    result[index] = resultItem
  }
  return result
}

const arrayMapWithIndex = function (array, mapper) {
  const arrayLength = array.length,
    result = Array(arrayLength)
  let index = -1, isAsync = false
  while (++index < arrayLength) {
    const resultItem = mapper(array[index], index, array)
    if (isPromise(resultItem)) {
      isAsync = true
    }
    result[index] = resultItem
  }
  return isAsync ? promiseAll(result) : result
}

const hasOwnProperty = Object.prototype.hasOwnProperty
const hasOwn = (obj, key) => hasOwnProperty.call(obj, key)

const objectMapOwn = function (object, mapper) {
  const result = {}
  let isAsync = false
  for (const key in object) {
    if (hasOwn(object, key)) {
      const resultItem = mapper(object[key])
      if (isPromise(resultItem)) {
        isAsync = true
      }
      result[key] = resultItem
    }
  }
  return isAsync ? promiseObjectAll(result) : result
}

const _curryArity = (arity, func, args) => function curried(...curriedArgs) {
  const argsLength = args.length,
    curriedArgsLength = curriedArgs.length,
    nextArgs = []
  let argsIndex = -1,
    curriedArgsIndex = -1,
    numCurriedPlaceholders = 0

  while (++argsIndex < argsLength) {
    const arg = args[argsIndex]
    if (arg == __ && (curriedArgsIndex += 1) < curriedArgsLength) {
      const curriedArg = curriedArgs[curriedArgsIndex]
      if (curriedArg == __) {
        numCurriedPlaceholders += 1
      }
      nextArgs.push(curriedArg)
    } else {
      nextArgs.push(arg)
    }
    if (nextArgs.length == arity) {
      return numCurriedPlaceholders == 0
        ? func(...nextArgs)
        : curryArity(arity, func, nextArgs)
    }
  }

  while (++curriedArgsIndex < curriedArgsLength) {
    const curriedArg = curriedArgs[curriedArgsIndex]
    if (curriedArg == __) {
      numCurriedPlaceholders += 1
    }
    nextArgs.push(curriedArg)
    if (nextArgs.length == arity) {
      return numCurriedPlaceholders == 0
        ? func(...nextArgs)
        : curryArity(arity, func, nextArgs)
    }
  }
  return curryArity(arity, func, nextArgs)
}

const curryArity = function (arity, func, args) {
  const argsLength = args.length
  if (argsLength < arity) {
    return _curryArity(arity, func, args)
  }
  let argsIndex = -1
  while (++argsIndex < argsLength) {
    const arg = args[argsIndex]
    if (arg == __) {
      return _curryArity(arity, func, args)
    }
  }
  return func(...args)
}

const spread2 = func => function spreading2([arg0, arg1]) {
  return func(arg0, arg1)
}

const objectMapEntries = function (object, mapper) {
  const result = {},
    promises = []
  for (const key in object) {
    const value = object[key],
      mapping = mapper([key, value])
    if (isPromise(mapping)) {
      promises.push(mapping.then(
        spread2(curryArity(3, objectSet, [result]))))
    } else {
      result[mapping[0]] = mapping[1]
    }
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(always(result))
}

const mapSet = function setting(source, key, value) {
  return source.set(key, value)
}

// (mapper function, result Map, promises Array<Promise>) => (key any, value any) => ()
const mapMapEntriesForEachCallback = (
  mapper, result, promises,
) => function callback(value, key) {
  const mapping = mapper([key, value])
  if (isPromise(mapping)) {
    promises.push(mapping.then(spread2(curryArity(3, mapSet, [result]))))
  } else {
    result.set(mapping[0], mapping[1])
  }
}

const mapMapEntries = function (source, mapper) {
  const result = new Map(),
    promises = []
  source.forEach(mapMapEntriesForEachCallback(mapper, result, promises))
  return promises.length == 0
    ? result
    : promiseAll(promises).then(always(result))
}

const map = mapper => function mapping(value) {
  if (isArray(value)) {
    return arrayMap(value, mapper)
  }
  if (typeof value == 'function') {
    if (isGeneratorFunction(value)) {
      return generatorFunctionMap(value, mapper)
    }
    if (isAsyncGeneratorFunction(value)) {
      return asyncGeneratorFunctionMap(value, mapper)
    }
    return reducerMap(value, mapper)
  }
  if (value == null) {
    return value
  }

  if (typeof value.then == 'function') {
    return value.then(mapper)
  }
  if (typeof value.map == 'function') {
    return value.map(mapper)
  }
  if (typeof value == 'string' || value.constructor == String) {
    return stringMap(value, mapper)
  }
  if (value.constructor == Set) {
    return setMap(value, mapper)
  }
  if (value.constructor == Map) {
    return mapMap(value, mapper)
  }
  if (value.constructor == Object) {
    return objectMap(value, mapper)
  }
  if (typeof value[symbolIterator] == 'function') {
    return MappingIterator(value[symbolIterator](), mapper)
  }
  if (typeof value[symbolAsyncIterator] == 'function') {
    return MappingAsyncIterator(value[symbolAsyncIterator](), mapper)
  }
  return mapper(value)
}

map.entries = function mapEntries(mapper) {
  return function mappingEntries(value) {
    if (value == null) {
      throw new TypeError('value is not an Object or Map')
    }
    if (value.constructor == Object) {
      return objectMapEntries(value, mapper)
    }
    if (value.constructor == Map) {
      return mapMapEntries(value, mapper)
    }
    throw new TypeError('value is not an Object or Map')
  }
}

map.series = mapper => function mappingInSeries(value) {
  if (isArray(value)) {
    return arrayMapSeries(value, mapper)
  }
  throw new TypeError(`${value} is not an Array`)
}

map.pool = (concurrencyLimit, mapper) => function concurrentPoolMapping(value) {
  if (isArray(value)) {
    return arrayMapPool(value, mapper, concurrencyLimit)
  }
  throw new TypeError(`${value} is not an Array`)
}

map.withIndex = mapper => function mappingWithIndex(value) {
  if (isArray(value)) {
    return arrayMapWithIndex(value, mapper)
  }
  throw new TypeError(`${value} is not an Array`)
}

map.own = mapper => function mappingOwnProperties(value) {
  if (isObject(value) && !isArray(value)) {
    return objectMapOwn(value, mapper)
  }
  throw new TypeError(`${value} is not an Object`)
}

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

const thunkify2 = (func, arg0, arg1) => function thunk() {
  return func(arg0, arg1)
}

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

const stringFilter = function (string, predicate) {
  const filteredCharactersArray = arrayFilter(string, predicate)
  return isPromise(filteredCharactersArray)
    ? filteredCharactersArray.then(curry3(callPropUnary, __, 'join', ''))
    : filteredCharactersArray.join('')
}

const thunkify1 = (func, arg0) => function thunk() {
  return func(arg0)
}

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

const objectValues = Object.values

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

const reduce = function (reducer, init) {
  if (typeof init == 'function') {
    return function reducing(...args) {
      const result = init(...args)
      return isPromise(result)
        ? result.then(curry3(genericReduce, args, reducer, __))
        : genericReduce(args, reducer, result)
    }
  }
  return curryArgs3(genericReduce, __, reducer, init)
}

const isBinary = ArrayBuffer.isView

const add = (a, b) => a + b

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

const arrayPush = function (array, value) {
  array.push(value)
  return array
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

const getArg1 = (arg0, arg1) => arg1

const identity = value => value

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

const arrayFlatMap = function (array, flatMapper) {
  const monadArray = arrayMap(array, flatMapper)
  return isPromise(monadArray)
    ? monadArray.then(arrayFlatten)
    : arrayFlatten(monadArray)
}

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

const objectFlatMap = function (object, flatMapper) {
  const monadObject = objectMap(object, flatMapper)
  return isPromise(monadObject)
    ? monadObject.then(objectFlatten)
    : objectFlatten(monadObject)
}

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

const setFlatMap = function (set, flatMapper) {
  const monadSet = setMap(set, flatMapper)
  return isPromise(monadSet)
    ? monadSet.then(setFlatten)
    : setFlatten(monadSet)
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

const SelfReferencingPromise = function (basePromise) {
  const promise = basePromise.then(res => [res, promise])
  return promise
}

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

const reducerAny = predicate => function anyReducer(result, item) {
  return result === true ? result
    : isPromise(result) ? result.then(curry2(reducerAnySync(predicate), __, item))
    : result ? true : predicate(item)
}

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

const arrayAll = function (array, predicate) {
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

const iteratorAll = function (iterator, predicate) {
  const promises = []
  for (const item of iterator) {
    const predication = predicate(item)
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

const asyncIteratorAll = async function (
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

const reducerAllSync = (predicate, result, item) => result ? predicate(item) : false

const reducerAll = predicate => function allReducer(result, item) {
  return result === false ? false
    : isPromise(result) ? result.then(
      curry3(reducerAllSync, predicate, __, item))
    : result ? predicate(item) : false
}

const all = predicate => function allTruthy(value) {
  if (isArray(value)) {
    return arrayAll(value, predicate)
  }
  if (value == null) {
    return predicate(value)
  }

  if (typeof value[symbolIterator] == 'function') {
    return iteratorAll(value[symbolIterator](), predicate)
  }
  if (typeof value[symbolAsyncIterator] == 'function') {
    return asyncIteratorAll(value[symbolAsyncIterator](), predicate, new Set())
  }
  if (typeof value.reduce == 'function') {
    return value.reduce(reducerAll(predicate), true)
  }
  if (value.constructor == Object) {
    return arrayAll(objectValues(value), predicate)
  }
  return predicate(value)
}

const asyncAnd = async function (predicates, value, index) {
  const length = predicates.length
  while (++index < length) {
    let predication = predicates[index](value)
    if (isPromise(predication)) {
      predication = await predication
    }
    if (!predication) {
      return false
    }
  }
  return true
}

const and = predicates => function allPredicates(value) {
  if (value != null && typeof value.and == 'function') {
    return value.and(predicates)
  }
  const length = predicates.length,
    promises = []
  let index = -1

  while (++index < length) {
    const predication = predicates[index](value)
    if (isPromise(predication)) {
      return predication.then(curry3(
        thunkConditional,
        __,
        thunkify3(asyncAnd, predicates, value, index),
        always(false)))
    }
    if (!predication) {
      return false
    }
  }
  return true
}

const asyncOr = async function (predicates, value) {
  const length = predicates.length
  let index = -1
  while (++index < length) {
    let predication = predicates[index](value)
    if (isPromise(predication)) {
      predication = await predication
    }
    if (predication) {
      return true
    }
  }
  return false
}

// handles the first predication before asyncOr
const _asyncOrInterlude = (
  predicates, value, firstPredication,
) => firstPredication ? true : asyncOr(predicates, value)

const or = predicates => function anyPredicates(value) {
  if (value != null && typeof value.or == 'function') {
    return value.or(predicates)
  }
  const length = predicates.length
  let index = -1

  while (++index < length) {
    const predication = predicates[index](value)
    if (isPromise(predication)) {
      return predication.then(curry3(_asyncOrInterlude, predicates, value, __))
    }
    if (predication) {
      return true
    }
  }
  return false
}

// true -> false
const _not = value => !value

const not = func => function logicalInverter(value) {
  if (value != null && typeof value.not == 'function') {
    return value.not(func)
  }
  const boolean = func(value)
  return isPromise(boolean) ? boolean.then(_not) : !boolean
}

const notSync = func => function notSync(...args) {
  return !func(...args)
}

not.sync = notSync

const sameValueZero = function (left, right) {
  return left === right || (left !== left && right !== right)
}

const eq = function (left, right) {
  const isLeftResolver = typeof left == 'function',
    isRightResolver = typeof right == 'function'
  if (isLeftResolver && isRightResolver) {
    return function equalBy(value) {
      const leftResolve = left(value),
        rightResolve = right(value)
      const isLeftPromise = isPromise(leftResolve),
        isRightPromise = isPromise(rightResolve)
      if (isLeftPromise && isRightPromise) {
        return promiseAll(
          [leftResolve, rightResolve]).then(spread2(sameValueZero))
      } else if (isLeftPromise) {
        return leftResolve.then(curry2(sameValueZero, __, rightResolve))
      } else if (isRightPromise) {
        return rightResolve.then(curry2(sameValueZero, leftResolve, __))
      }
      return sameValueZero(leftResolve, rightResolve)
    }
  }

  if (isLeftResolver) {
    return function equalBy(value) {
      const leftResolve = left(value)
      return isPromise(leftResolve)
        ? leftResolve.then(curry2(sameValueZero, __, right))
        : sameValueZero(leftResolve, right)
    }
  }
  if (isRightResolver) {
    return function equalBy(value) {
      const rightResolve = right(value)
      return isPromise(rightResolve)
        ? rightResolve.then(curry2(sameValueZero, left, __))
        : sameValueZero(left, rightResolve)
    }
  }
  return function equalBy(value) {
    return value != null && typeof value.eq == 'function'
      ? value.eq(left, right)
      : sameValueZero(left, right)
  }
}

const greaterThan = (left, right) => left > right

const gt = function (left, right) {
  const isLeftResolver = typeof left == 'function',
    isRightResolver = typeof right == 'function'
  if (isLeftResolver && isRightResolver) {
    return function greaterThanBy(value) {
      const leftResolve = left(value),
        rightResolve = right(value)
      const isLeftPromise = isPromise(leftResolve),
        isRightPromise = isPromise(rightResolve)
      if (isLeftPromise && isRightPromise) {
        return promiseAll(
          [leftResolve, rightResolve]).then(spread2(greaterThan))
      } else if (isLeftPromise) {
        return leftResolve.then(curry2(greaterThan, __, rightResolve))
      } else if (isRightPromise) {
        return rightResolve.then(curry2(greaterThan, leftResolve, __))
      }
      return leftResolve > rightResolve
    }
  }

  if (isLeftResolver) {
    return function greaterThanBy(value) {
      const leftResolve = left(value)
      return isPromise(leftResolve)
        ? leftResolve.then(curry2(greaterThan, __, right))
        : leftResolve > right
    }
  }
  if (isRightResolver) {
    return function strictEqualBy(value) {
      const rightResolve = right(value)
      return isPromise(rightResolve)
        ? rightResolve.then(curry2(greaterThan, left, __))
        : left > rightResolve
    }
  }
  return function greaterThanBy(value) {
    return value != null && typeof value.eq == 'function'
      ? value.gt(left, right)
      : left > right
  }
}

const lessThan = (left, right) => left < right

const lt = function (left, right) {
  const isLeftResolver = typeof left == 'function',
    isRightResolver = typeof right == 'function'
  if (isLeftResolver && isRightResolver) {
    return function lessThanBy(value) {
      const leftResolve = left(value),
        rightResolve = right(value)
      const isLeftPromise = isPromise(leftResolve),
        isRightPromise = isPromise(rightResolve)
      if (isLeftPromise && isRightPromise) {
        return promiseAll(
          [leftResolve, rightResolve]).then(spread2(lessThan))
      } else if (isLeftPromise) {
        return leftResolve.then(curry2(lessThan, __, rightResolve))
      } else if (isRightPromise) {
        return rightResolve.then(curry2(lessThan, leftResolve, __))
      }
      return leftResolve < rightResolve
    }
  }

  if (isLeftResolver) {
    return function lessThanBy(value) {
      const leftResolve = left(value)
      return isPromise(leftResolve)
        ? leftResolve.then(curry2(lessThan, __, right))
        : leftResolve < right
    }
  }
  if (isRightResolver) {
    return function lessThanBy(value) {
      const rightResolve = right(value)
      return isPromise(rightResolve)
        ? rightResolve.then(curry2(lessThan, left, __))
        : left < rightResolve
    }
  }
  return function lessThanBy(value) {
    return value != null && typeof value.eq == 'function'
      ? value.lt(left, right)
      : left < right
  }
}

const greaterThanOrEqual = (left, right) => left >= right

const gte = function (left, right) {
  const isLeftResolver = typeof left == 'function',
    isRightResolver = typeof right == 'function'
  if (isLeftResolver && isRightResolver) {
    return function greaterThanOrEqualBy(value) {
      const leftResolve = left(value),
        rightResolve = right(value)
      const isLeftPromise = isPromise(leftResolve),
        isRightPromise = isPromise(rightResolve)
      if (isLeftPromise && isRightPromise) {
        return promiseAll(
          [leftResolve, rightResolve]).then(spread2(greaterThanOrEqual))
      } else if (isLeftPromise) {
        return leftResolve.then(curry2(greaterThanOrEqual, __, rightResolve))
      } else if (isRightPromise) {
        return rightResolve.then(curry2(greaterThanOrEqual, leftResolve, __))
      }
      return leftResolve >= rightResolve
    }
  }

  if (isLeftResolver) {
    return function greaterThanOrEqualBy(value) {
      const leftResolve = left(value)
      return isPromise(leftResolve)
        ? leftResolve.then(curry2(greaterThanOrEqual, __, right))
        : leftResolve >= right
    }
  }
  if (isRightResolver) {
    return function greaterThanOrEqualBy(value) {
      const rightResolve = right(value)
      return isPromise(rightResolve)
        ? rightResolve.then(curry2(greaterThanOrEqual, left, __))
        : left >= rightResolve
    }
  }
  return function greaterThanOrEqualBy(value) {
    return value != null && typeof value.eq == 'function'
      ? value.gte(left, right)
      : left >= right
  }
}

const lessThanOrEqual = (left, right) => left <= right

const lte = function (left, right) {
  const isLeftResolver = typeof left == 'function',
    isRightResolver = typeof right == 'function'
  if (isLeftResolver && isRightResolver) {
    return function lessThanOrEqualBy(value) {
      const leftResolve = left(value),
        rightResolve = right(value)
      const isLeftPromise = isPromise(leftResolve),
        isRightPromise = isPromise(rightResolve)
      if (isLeftPromise && isRightPromise) {
        return promiseAll(
          [leftResolve, rightResolve]).then(spread2(lessThanOrEqual))
      } else if (isLeftPromise) {
        return leftResolve.then(curry2(lessThanOrEqual, __, rightResolve))
      } else if (isRightPromise) {
        return rightResolve.then(curry2(lessThanOrEqual, leftResolve, __))
      }
      return leftResolve <= rightResolve
    }
  }

  if (isLeftResolver) {
    return function lessThanOrEqualBy(value) {
      const leftResolve = left(value)
      return isPromise(leftResolve)
        ? leftResolve.then(curry2(lessThanOrEqual, __, right))
        : leftResolve <= right
    }
  }
  if (isRightResolver) {
    return function lessThanOrEqualBy(value) {
      const rightResolve = right(value)
      return isPromise(rightResolve)
        ? rightResolve.then(curry2(lessThanOrEqual, left, __))
        : left <= rightResolve
    }
  }
  return function lessThanOrEqualBy(value) {
    return value != null && typeof value.eq == 'function'
      ? value.lte(left, right)
      : left <= right
  }
}

const memoizeCappedUnary = function (func, cap) {
  const cache = new Map(),
    memoized = function memoized(arg0) {
      if (cache.has(arg0)) {
        return cache.get(arg0)
      }
      const result = func(arg0)
      cache.set(arg0, result)
      if (cache.size > cap) {
        cache.clear()
      }
      return result
    }
  memoized.cache = cache
  return memoized
}

// a[0].b.c
const pathDelimiters = /[.|[|\]]+/

const parsePropertyPath = function (pathString) {
  const pathStringLastIndex = pathString.length - 1,
    firstChar = pathString[0],
    lastChar = pathString[pathStringLastIndex],
    isFirstCharLeftBracket = firstChar == '[',
    isLastCharRightBracket = lastChar == ']'

  if (isFirstCharLeftBracket && isLastCharRightBracket) {
    return pathString.slice(1, pathStringLastIndex).split(pathDelimiters)
  } else if (isFirstCharLeftBracket) {
    return pathString.slice(1).split(pathDelimiters)
  } else if (isLastCharRightBracket) {
    return pathString.slice(0, pathStringLastIndex).split(pathDelimiters)
  }
  return pathString.split(pathDelimiters)
}

// memoized version of parsePropertyPath, max cache size 500
const memoizedCappedParsePropertyPath = memoizeCappedUnary(parsePropertyPath, 500)

const propertyPathToArray = path => isArray(path) ? path
  : typeof path == 'string' ? memoizedCappedParsePropertyPath(path)
  : [path]

const getByPath = function (value, path) {
  const propertyPathArray = propertyPathToArray(path),
    length = propertyPathArray.length
  let index = -1,
    result = value
  while (++index < length) {
    result = result[propertyPathArray[index]]
    if (result == null) {
      return undefined
    }
  }
  return result
}

const get = (path, defaultValue) => function getter(value) {
  const result = value == null ? undefined : getByPath(value, path)
  return result === undefined
    ? typeof defaultValue == 'function' ? defaultValue(value) : defaultValue
    : result
}

const setByPath = function (obj, value, path) {
  if (!isObject(obj)){
    return obj
  }
  const pathArray = propertyPathToArray(path)
  const pathLength = pathArray.length
  const lastIndex = pathLength - 1
  const result = { ...obj }
  let nested = result
  let index = -1
  while (++index < pathLength){
    const pathKey = pathArray[index]
    if (index == lastIndex){
      nested[pathKey] = value
    } else {
      const existingNextNested = nested[pathKey]
      const nextNested = isArray(existingNextNested)
        ? existingNextNested.slice() : { ...existingNextNested }
      nested[pathKey] = nextNested
      nested = nextNested
    }
  }
  return result
}

const set = (path, value) => function setter(obj) {
  return setByPath(obj, value, path)
}

const pick = keys => function picking(source) {
  if (source == null) {
    return source
  }
  const keysLength = keys.length
  let result = {}
  let keysIndex = -1
  while (++keysIndex < keysLength) {
    const key = keys[keysIndex],
      value = getByPath(source, key)
    if (value != null) {
      result = setByPath(result, value, key)
    }
  }
  return result
}

const deleteByPath = function (object, path) {
  if (object == null) {
    return undefined
  }
  const pathArray = propertyPathToArray(path),
    lengthMinusOne = pathArray.length - 1
  let index = -1,
    result = object
  while (++index < lengthMinusOne) {
    result = result[pathArray[index]]
    if (result == null) {
      return undefined
    }
  }
  const property = pathArray[index]
  if (result != null && property in result) {
    delete result[property]
  }
  return undefined
}

// objectCopyDeep(array Array) -> copied Array
const objectCopyDeep = function (object) {
  const result = {}
  for (const key in object) {
    const item = object[key]
    if (isArray(item)) {
      result[key] = arrayCopyDeep(item)
    } else if (item != null && item.constructor == Object) {
      result[key] = objectCopyDeep(item)
    } else {
      result[key] = item
    }
  }
  return result
}

// arrayCopyDeep(array Array) -> copied Array
const arrayCopyDeep = function (array) {
  const length = array.length,
    result = []
  let index = -1
  while (++index < length) {
    const item = array[index]
    if (isArray(item)) {
      result[index] = arrayCopyDeep(item)
    } else if (item != null && item.constructor == Object) {
      result[index] = objectCopyDeep(item)
    } else {
      result[index] = item
    }
  }
  return result
}

const copyDeep = function (value) {
  if (isArray(value)) {
    return arrayCopyDeep(value)
  }
  if (value == null) {
    return value
  }
  if (value.constructor == Object) {
    return objectCopyDeep(value)
  }
  return value
}

const omit = paths => function omitting(source) {
  const pathsLength = paths.length,
    result = copyDeep(source)
  let pathsIndex = -1
  while (++pathsIndex < pathsLength) {
    deleteByPath(result, paths[pathsIndex])
  }
  return result
}

const thunkify = (func, ...args) => function thunk() {
  return func(...args)
}

const curry = (func, ...args) => curryArity(func.length, func, args)

curry.arity = function curryArity_(arity, func, ...args) {
  return curryArity(arity, func, args)
}

const rubico = {
  pipe, tap,
  switchCase, tryCatch,
  fork, assign, get, set, pick, omit,
  map, filter, reduce, transform, flatMap,
  and, or, not, any, all,
  eq, gt, lt, gte, lte,
  thunkify, always,
  curry, __,
}

export default rubico
