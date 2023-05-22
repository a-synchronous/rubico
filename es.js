/**
 * rubico v1.9.7
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2023 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const isPromise = value => value != null && typeof value.then == 'function'

const areAnyValuesPromises = function (values) {
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

const promiseAll = Promise.all.bind(Promise)

const funcConcat = (
  funcA, funcB,
) => function pipedFunction(...args) {
  const intermediate = funcA(...args)
  return isPromise(intermediate)
    ? intermediate.then(funcB)
    : funcB(intermediate)
}

const funcApply = (func, args) => func(...args)

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

const pipe = function (...args) {
  const funcs = args.pop()
  const pipeline = funcs.reduce(funcConcat)

  if (args.length == 0) {
    return pipeline
  }

  if (areAnyValuesPromises(args)) {
    return promiseAll(args).then(curry2(funcApply, pipeline, __))
  }

  return pipeline(...args)
}

const compose = function (...args) {
  const funcs = args.pop()
  const composition = funcs.reduceRight(funcConcat)

  if (args.length == 0) {
    return composition
  }

  if (areAnyValuesPromises(args)) {
    return promiseAll(args).then(curry2(funcApply, composition, __))
  }

  return composition(...args)
}

const always = value => function getter() { return value }

const thunkifyArgs = (func, args) => function thunk() {
  return func(...args)
}

const thunkConditional = (
  conditionalExpression, thunkOnTruthy, thunkOnFalsy,
) => conditionalExpression ? thunkOnTruthy() : thunkOnFalsy()

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

const tap = func => function tapping(...args) {
  const result = args[0],
    call = func(...args)
  return isPromise(call) ? call.then(always(result)) : result
}

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

const isArray = Array.isArray

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

const functionArrayAll = function (funcs, args) {
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

const objectSet = function (object, property, value) {
  object[property] = value
  return object
}

const asyncFunctionArrayAllSeries = async function (funcs, args, result, funcsIndex) {
  const funcsLength = funcs.length
  while (++funcsIndex < funcsLength) {
    const resultItem = funcs[funcsIndex](...args)
    result[funcsIndex] = isPromise(resultItem) ? await resultItem : resultItem
  }
  return result
}

const functionArrayAllSeries = function (funcs, args) {
  const funcsLength = funcs.length, result = []
  let funcsIndex = -1
  while (++funcsIndex < funcsLength) {
    const resultItem = funcs[funcsIndex](...args)
    if (isPromise(resultItem)) {
      return resultItem.then(funcConcat(
        curry3(objectSet, result, funcsIndex, __),
        curry4(asyncFunctionArrayAllSeries, funcs, args, __, funcsIndex)))
    }
    result[funcsIndex] = resultItem
  }
  return result
}

const functionObjectAll = function (funcs, args) {
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

const all = function (...args) {
  const funcs = args.pop()
  if (args.length == 0) {
    return isArray(funcs)
      ? curryArgs2(functionArrayAll, funcs, __)
      : curryArgs2(functionObjectAll, funcs, __)
  }

  if (areAnyValuesPromises(args)) {
    return isArray(funcs)
      ? promiseAll(args).then(curry2(functionArrayAll, funcs, __))
      : promiseAll(args).then(curry2(functionObjectAll, funcs, __))
  }

  return isArray(funcs)
    ? functionArrayAll(funcs, args)
    : functionObjectAll(funcs, args)
}

all.series = function allSeries(...args) {
  const funcs = args.pop()
  if (args.length == 0) {
    return curryArgs2(functionArrayAllSeries, funcs, __)
  }
  if (areAnyValuesPromises(args)) {
    return promiseAll(args).then(curry2(functionArrayAllSeries, funcs, __))
  }
  return functionArrayAllSeries(funcs, args)
}

const objectAssign = Object.assign

// _assign(object Object, funcs Object<function>) -> Promise|Object
const _assign = function (object, funcs) {
  const result = functionObjectAll(funcs, [object])
  return isPromise(result)
    ? result.then(curry3(objectAssign, {}, object, __))
    : ({ ...object, ...result })
}

const assign = function (arg0, arg1) {
  if (arg1 == null) {
    return curry2(_assign, __, arg0)
  }
  return isPromise(arg0)
    ? arg0.then(curry2(_assign, __, arg1))
    : _assign(arg0, arg1)
}

const catcherApply = function (catcher, err, args) {
  return catcher(err, ...args)
}

// _tryCatch(tryer function, catcher function, args Array) -> Promise
const _tryCatch = function (tryer, catcher, args) {
  try {
    const result = tryer(...args)
    return isPromise(result)
      ? result.catch(curry3(catcherApply, catcher, __, args))
      : result
  } catch (error) {
    return catcher(error, ...args)
  }
}

const tryCatch = function (...args) {
  if (args.length > 2) {
    const catcher = args.pop(),
      tryer = args.pop()
    if (areAnyValuesPromises(args)) {
      return promiseAll(args)
        .then(curry3(_tryCatch, tryer, catcher, __))
    }
    return _tryCatch(tryer, catcher, args)
  }

  const tryer = args[0],
    catcher = args[1]
  return function tryCatcher(...args) {
    return _tryCatch(tryer, catcher, args)
  }
}

const thunkify3 = (func, arg0, arg1, arg2) => function thunk() {
  return func(arg0, arg1, arg2)
}

const arrayConditional = function (array, args, funcsIndex) {
  const lastIndex = array.length - 1

  while ((funcsIndex += 2) < lastIndex) {
    const predicate = array[funcsIndex],
      resolverOrValue = array[funcsIndex + 1]

    const predication = typeof predicate == 'function'
      ? predicate(...args)
      : predicate

    if (isPromise(predication)) {
      return predication.then(curry3(
        thunkConditional,
        __,
        typeof resolverOrValue == 'function'
          ? thunkifyArgs(resolverOrValue, args)
          : always(resolverOrValue),
        thunkify3(arrayConditional, array, args, funcsIndex),
      ))
    }

    if (predication) {
      return typeof resolverOrValue == 'function'
        ? resolverOrValue(...args)
        : resolverOrValue
    }
  }

  // even number of array
  if (funcsIndex == array.length) {
    return undefined
  }

  const defaultResolverOrValue = array[lastIndex]
  return typeof defaultResolverOrValue == 'function'
    ? defaultResolverOrValue(...args)
    : defaultResolverOrValue
}

const areAllValuesNonfunctions = function (values) {
  const length = values.length
  let index = -1
  while (++index < length) {
    if (typeof values[index] == 'function') {
      return false
    }
  }
  return true
}

const thunkify2 = (func, arg0, arg1) => function thunk() {
  return func(arg0, arg1)
}

const nonfunctionsConditional = function (array, index) {
  const length = array.length,
    lastIndex = length - 1
  while ((index += 2) < lastIndex) {
    const predication = array[index],
      value = array[index + 1]
    if (isPromise(predication)) {
      return predication.then(curry3(
        thunkConditional,
        __,
        always(value),
        thunkify2(nonfunctionsConditional, array, index),
      ))
    }
    if (predication) {
      return value
    }
  }
  // even number of array values
  if (index == length) {
    return undefined
  }
  return array[index]
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

const switchCase = (...args) => {
  const values = args.pop()
  if (areAllValuesNonfunctions(values)) {
    return nonfunctionsConditional(values, -2)
  }
  if (args.length == 0) {
    return curryArgs3(arrayConditional, values, __, -2)
  }
  if (areAnyValuesPromises(args)) {
    return promiseAll(args).then(curry3(arrayConditional, values, __, -2))
  }
  return arrayConditional(values, args, -2)
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

const tapSync = func => function tapping(...args) {
  func(...args)
  return args[0]
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

const _map = function (value, mapper) {
  if (isArray(value)) {
    return arrayMap(value, mapper)
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
  if (typeof value[symbolIterator] == 'function') {
    return MappingIterator(value[symbolIterator](), mapper)
  }
  if (typeof value[symbolAsyncIterator] == 'function') {
    return MappingAsyncIterator(value[symbolAsyncIterator](), mapper)
  }
  if (value.constructor == Object) {
    return objectMap(value, mapper)
  }
  return mapper(value)
}

const map = (...args) => {
  const mapper = args.pop()
  if (args.length == 0) {
    return curry2(_map, __, mapper)
  }

  const collection = args[0]
  if (isPromise(collection)) {
    return collection.then(curry2(_map, __, mapper))
  }
  return _map(collection, mapper)
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
      shouldIncludeItem = predicate(item, index, array)
    if (isPromise(shouldIncludeItem)) {
      return promiseAll(
        arrayExtendMap([shouldIncludeItem], array, predicate, index)
      ).then(curry4(arrayFilterByConditions, array, result, index - 1, __))
    }
    if (shouldIncludeItem) {
      result[++resultIndex] = item
    }
  }
  return result
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

const noop = function () {}

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

const filter = function (...args) {
  const predicate = args.pop()
  if (args.length == 0) {
    return curry2(_filter, __, predicate)
  }
  return _filter(args[0], predicate)
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
) => function pipedReducer(result, item) {
  const intermediate = reducerA(result, item)
  return isPromise(intermediate)
    ? intermediate.then(curry2(reducerB, __, item))
    : reducerB(intermediate, item)
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

// _reduce(collection any, reducer function, initialValue function|any) -> Promise
const _reduce = function (collection, reducer, initialValue) {
  if (typeof initialValue == 'function') {
    const actualInitialValue = initialValue(collection)
    return isPromise(actualInitialValue)
      ? actualInitialValue.then(curry3(genericReduce, collection, reducer, __))
      : genericReduce(collection, reducer, actualInitialValue)
  }
  return isPromise(initialValue)
    ? initialValue.then(curry3(genericReduce, collection, reducer, __))
    : genericReduce(collection, reducer, initialValue)
}

const reduce = function (...args) {
  if (typeof args[0] == 'function') {
    return curry3(_reduce, __, args[0], args[1])
  }
  if (isPromise(args[0])) {
    return args[0].then(curry3(_reduce, __, args[1], args[2]))
  }
  return _reduce(args[0], args[1], args[2])
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

const identityTransform = function (collection, transducer, result) {
  const nil = genericReduce(collection, transducer(noop), null)
  return isPromise(nil) ? nil.then(always(result)) : result
}

const genericTransform = function (collection, transducer, result) {
  if (isArray(result)) {
    return genericReduce(collection, transducer(arrayExtend), result)
  }
  if (isBinary(result)) {
    const intermediateArray = genericReduce(collection, transducer(arrayExtend), [])
    return isPromise(intermediateArray)
      ? intermediateArray.then(curry2(binaryExtend, result, __))
      : binaryExtend(result, intermediateArray)
  }
  if (result == null) {
    return identityTransform(collection, transducer, result)
  }

  const resultConstructor = result.constructor
  if (typeof result == 'string' || resultConstructor == String) {
    // TODO: use array + join over adding
    return genericReduce(collection, transducer(add), result)
  }
  if (typeof result.concat == 'function') {
    return genericReduce(collection, transducer(callConcat), result)
  }
  if (typeof result.write == 'function') {
    return genericReduce(collection, transducer(streamExtend), result)
  }
  if (resultConstructor == Set) {
    return genericReduce(collection, transducer(setExtend), result)
  }
  if (resultConstructor == Object) {
    return genericReduce(collection, transducer(objectAssign), result)
  }
  return identityTransform(collection, transducer, result)
}

// _transform(collection any, transducer function, initialValue function|any) -> Promise
const _transform = function (collection, transducer, initialValue) {
  if (typeof initialValue == 'function') {
    const actualInitialValue = initialValue(collection)
    return isPromise(actualInitialValue)
      ? actualInitialValue.then(curry3(genericTransform, collection, transducer, __))
      : genericTransform(collection, transducer, actualInitialValue)
  }
  return isPromise(initialValue)
    ? initialValue.then(curry3(genericTransform, collection, transducer, __))
    : genericTransform(collection, transducer, initialValue)
}

const transform = function (...args) {
  if (typeof args[0] == 'function') {
    return curry3(_transform, __, args[0], args[1])
  }
  if (isPromise(args[0])) {
    return args[0].then(curry3(_transform, __, args[1], args[2]))
  }
  return _transform(args[0], args[1], args[2])
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
        flatMapper(iteration.value),
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

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

const FlatMappingAsyncIterator = function (asyncIterator, flatMapper) {
  const buffer = [],
    promises = new Set()

  return {
    isAsyncIteratorDone: false,
    [symbolAsyncIterator]() {
      return this
    },
    toString() {
      return '[object FlatMappingAsyncIterator]'
    },

    
    async next() {
      while (
        !this.isAsyncIteratorDone || buffer.length > 0 || promises.size > 0
      ) {
        if (!this.isAsyncIteratorDone) {
          const { value, done } = await asyncIterator.next()
          if (done) {
            this.isAsyncIteratorDone = done
          } else {
            const monad = flatMapper(value)
            if (isPromise(monad)) {
              const bufferLoading =
                monad.then(curry3(genericReduce, __, arrayPush, buffer))
              const promise = bufferLoading.then(() => promises.delete(promise))
              promises.add(promise)
            } else {
              const bufferLoading = genericReduce(monad, arrayPush, buffer)
              if (isPromise(bufferLoading)) {
                const promise = bufferLoading.then(() => promises.delete(promise))
                promises.add(promise)
              }
            }
          }
        }
        if (buffer.length > 0) {
          return { value: buffer.shift(), done: false }
        }
        if (promises.size > 0) {
          await promiseRace([sleep(1000), ...promises])
        }
      }
      return { value: undefined, done: true }
    },
  }
}

const getArg1 = (arg0, arg1) => arg1

const identity = value => value

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

const _flatMap = function (value, flatMapper) {
  if (isArray(value)) {
    return arrayFlatMap(value, flatMapper)
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

const flatMap = (...args) => {
  const flatMapper = args.pop()
  if (args.length == 0) {
    return curry2(_flatMap, __, flatMapper)
  }
  const collection = args[0]
  return isPromise(collection)
    ? collection.then(curry2(_flatMap, __, flatMapper))
    : _flatMap(args[0], flatMapper)
}

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
    return collection.forEach(callback)
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

const forEach = function (...args) {
  const callback = args.pop()
  if (args.length == 0) {
    return curry2(_forEach, __, callback)
  }
  const collection = args[0]
  return isPromise(collection)
    ? collection.then(curry2(_forEach, __, callback))
    : _forEach(collection, callback)
}

const SelfReferencingPromise = function (basePromise) {
  const promise = basePromise.then(res => [res, promise])
  return promise
}

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

const asyncIteratorSome = async function (
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

const iteratorSome = function (iterator, predicate) {
  for (const item of iterator) {
    const predication = predicate(item)
    if (isPromise(predication)) {
      return asyncIteratorSome(
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

const reducerSome = predicate => function anyReducer(result, item) {
  return result === true ? result
    : isPromise(result) ? result.then(curry2(reducerAnySync(predicate), __, item))
    : result ? true : predicate(item)
}

// _some(collection Array|Iterable|AsyncIterable|{ reduce: function }|Object, predicate function) -> Promise|boolean
const _some = function (collection, predicate) {
  if (isArray(collection)) {
    return arraySome(collection, predicate)
  }
  if (collection == null) {
    return predicate(collection)
  }
  if (typeof collection[symbolIterator] == 'function') {
    return iteratorSome(collection[symbolIterator](), predicate)
  }
  if (typeof collection[symbolAsyncIterator] == 'function') {
    return asyncIteratorSome(
      collection[symbolAsyncIterator](), predicate, new Set()
    )
  }
  if (typeof collection.reduce == 'function') {
    return collection.reduce(reducerSome(predicate), false)
  }
  if (collection.constructor == Object) {
    return arraySome(objectValues(collection), predicate)
  }
  return predicate(collection)
}

const some = function (...args) {
  const predicate = args.pop()
  if (args.length == 0) {
    return curry2(_some, __, predicate)
  }

  const collection = args[0]
  if (isPromise(collection)) {
    return collection.then(curry2(_some, __, predicate))
  }

  return _some(collection, predicate)
}

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

const reducerAllSync = (predicate, result, item) => result ? predicate(item) : false

const reducerEvery = predicate => function allReducer(result, item) {
  return result === false ? false
    : isPromise(result) ? result.then(
      curry3(reducerAllSync, predicate, __, item))
    : result ? predicate(item) : false
}

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

const every = function (...args) {
  const predicate = args.pop()
  if (args.length == 0) {
    return curry2(_every, __, predicate)
  }

  const collection = args[0]
  if (isPromise(collection)) {
    return collection.then(curry2(_every, __, predicate))
  }

  return _every(collection, predicate)
}

const areAllValuesTruthy = function (predicates, index) {
  const length = predicates.length
  while (++index < length) {
    let predicate = predicates[index]
    if (isPromise(predicate)) {
      return predicate.then(curry3(
        thunkConditional,
        __,
        thunkify2(areAllValuesTruthy, predicates, index),
        always(false),
      ))
    }
    if (!predicate) {
      return false
    }
  }
  return true
}

const asyncArePredicatesAllTruthy = async function (args, predicates, index) {
  const length = predicates.length
  while (++index < length) {
    let predicate = predicates[index]
    if (typeof predicate == 'function') {
      predicate = predicate(...args)
    }
    if (isPromise(predicate)) {
      predicate = await predicate
    }
    if (!predicate) {
      return false
    }
  }
  return true
}

// areAllPredicatesTruthy(args Array, predicates Array<function>) -> Promise|boolean
const areAllPredicatesTruthy = function (args, predicates) {
  const length = predicates.length
  let index = -1

  while (++index < length) {
    let predicate = predicates[index]
    if (typeof predicate == 'function') {
      predicate = predicate(...args)
    }
    if (isPromise(predicate)) {
      return predicate.then(curry3(
        thunkConditional,
        __,
        thunkify3(asyncArePredicatesAllTruthy, args, predicates, index),
        always(false),
      ))
    }
    if (!predicate) {
      return false
    }
  }
  return true
}

const and = function (...args) {
  const predicatesOrValues = args.pop()
  if (areAllValuesNonfunctions(predicatesOrValues)) {
    return areAllValuesTruthy(predicatesOrValues, -1)
  }

  if (args.length == 0) {
    return curryArgs2(areAllPredicatesTruthy, __, predicatesOrValues)
  }

  if (areAnyValuesPromises(args)) {
    return promiseAll(args)
      .then(curry2(areAllPredicatesTruthy, __, predicatesOrValues))
  }

  return areAllPredicatesTruthy(args, predicatesOrValues)
}

const areAnyNonfunctionsTruthy = function (predicates, index) {
  const length = predicates.length
  while (++index < length) {
    const predicate = predicates[index]
    if (isPromise(predicate)) {
      return predicate.then(curry3(
        thunkConditional,
        __,
        always(true),
        thunkify2(areAnyNonfunctionsTruthy, predicates, index),
      ))
    }
    if (predicate) {
      return true
    }
  }
  return false
}

const asyncAreAnyPredicatesTruthy = async function (args, predicates, index) {
  const length = predicates.length
  while (++index < length) {
    let predicate = predicates[index]
    if (typeof predicate == 'function') {
      predicate = predicate(...args)
    }
    if (isPromise(predicate)) {
      predicate = await predicate
    }
    if (predicate) {
      return true
    }
  }
  return false
}

// areAnyPredicatesTruthy(args Array, predicates Array<function>) -> Promise|boolean
const areAnyPredicatesTruthy = function (args, predicates) {
  const length = predicates.length
  let index = -1

  while (++index < length) {
    let predicate = predicates[index]
    if (typeof predicate == 'function') {
      predicate = predicate(...args)
    }
    if (isPromise(predicate)) {
      return predicate.then(curry3(
        thunkConditional,
        __,
        always(true),
        thunkify3(asyncAreAnyPredicatesTruthy, args, predicates, index),
      ))
    }
    if (predicate) {
      return true
    }
  }
  return false
}

const or = function (...args) {
  const predicatesOrValues = args.pop()
  if (areAllValuesNonfunctions(predicatesOrValues)) {
    return areAnyNonfunctionsTruthy(predicatesOrValues, -1)
  }

  if (args.length == 0) {
    return curryArgs2(areAnyPredicatesTruthy, __, predicatesOrValues)
  }

  if (areAnyValuesPromises(args)) {
    return promiseAll(args)
      .then(curry2(areAnyPredicatesTruthy, __, predicatesOrValues))
  }

  return areAnyPredicatesTruthy(args, predicatesOrValues)
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
  return !predicateOrValue
}

// argument resolver for curryArgs4
const curryArgs4ResolveArgs0 = (
  baseFunc, arg1, arg2, arg3,
) => function args0Resolver(...args) {
  return baseFunc(args, arg1, arg2, arg3)
}

// argument resolver for curryArgs4
const curryArgs4ResolveArgs1 = (
  baseFunc, arg0, arg2, arg3,
) => function args1Resolver(...args) {
  return baseFunc(arg0, args, arg2, arg3)
}

// argument resolver for curryArgs4
const curryArgs4ResolveArgs2 = (
  baseFunc, arg0, arg1, arg3,
) => function args2Resolver(...args) {
  return baseFunc(arg0, arg1, args, arg3)
}

// argument resolver for curryArgs4
const curryArgs4ResolveArgs3 = (
  baseFunc, arg0, arg1, arg2,
) => function args3Resolver(...args) {
  return baseFunc(arg0, arg1, arg2, args)
}

const curryArgs4 = function (baseFunc, arg0, arg1, arg2, arg3) {
  if (arg0 == __) {
    return curryArgs4ResolveArgs0(baseFunc, arg1, arg2, arg3)
  }
  if (arg1 == __) {
    return curryArgs4ResolveArgs1(baseFunc, arg0, arg2, arg3)
  }
  if (arg2 == __) {
    return curryArgs4ResolveArgs2(baseFunc, arg0, arg1, arg3)
  }
  return curryArgs4ResolveArgs3(baseFunc, arg0, arg1, arg2)
}

// leftResolverRightResolverCompare(
//   args Array, comparator function, left function, right function,
// ) -> Promise|boolean
const leftResolverRightResolverCompare = function (
  args, comparator, left, right,
) {
  const leftResult = left(...args),
    rightResult = right(...args)
  if (isPromise(leftResult) || isPromise(rightResult)) {
    return promiseAll([leftResult, rightResult]).then(spread2(comparator))
  }
  return comparator(leftResult, rightResult)
}

// leftResolverRightValueCompare(
//   args Array, comparator function, left function, right any
// ) -> Promise|boolean
const leftResolverRightValueCompare = function (args, comparator, left, right) {
  const leftResult = left(...args)
  if (isPromise(leftResult) || isPromise(right)) {
    return promiseAll([leftResult, right]).then(spread2(comparator))
  }
  return comparator(leftResult, right)
}

// leftValueRightResolverCompare(
//   args Array, comparator function, left any, right any,
// ) -> Promise|boolean
const leftValueRightResolverCompare = function (args, comparator, left, right) {
  const rightResult = right(...args)
  if (isPromise(left) || isPromise(rightResult)) {
    return promiseAll([left, rightResult]).then(spread2(comparator))
  }
  return comparator(left, rightResult)
}

// ComparisonOperator(comparator function) -> operator function
const ComparisonOperator = comparator => function operator(...args) {
  const right = args.pop()
  const left = args.pop()
  const isLeftResolver = typeof left == 'function',
    isRightResolver = typeof right == 'function'

  if (isLeftResolver && isRightResolver) {
    if (args.length == 0) {
      return curryArgs4(
        leftResolverRightResolverCompare, __, comparator, left, right,
      )
    }
    if (areAnyValuesPromises(args)) {
      return promiseAll(args).then(curryArgs4(
        leftResolverRightResolverCompare, __, comparator, left, right,
      ))
    }
    return leftResolverRightResolverCompare(args, comparator, left, right)
  }

  if (isLeftResolver) {
    return curryArgs4(
      leftResolverRightValueCompare, __, comparator, left, right,
    )
  }

  if (isRightResolver) {
    return curryArgs4(
      leftValueRightResolverCompare, __, comparator, left, right,
    )
  }

  return comparator(left, right)
}

const equals = function (left, right) {
  return left == right
}

const eq = ComparisonOperator(equals)

const greaterThan = (left, right) => left > right

const gt = ComparisonOperator(greaterThan)

const lessThan = (left, right) => left < right

const lt = ComparisonOperator(lessThan)

const greaterThanOrEqual = (left, right) => left >= right

const gte = ComparisonOperator(greaterThanOrEqual)

const lessThanOrEqual = (left, right) => left <= right

const lte = ComparisonOperator(lessThanOrEqual)

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

// _get(object Object, path string, defaultValue function|any)
const _get = function (object, path, defaultValue) {
  const result = object == null ? undefined : getByPath(object, path)
  return result === undefined
    ? typeof defaultValue == 'function' ? defaultValue(object) : defaultValue
    : result
}

const get = function (arg0, arg1, arg2) {
  if (isPromise(arg0)) {
    return arg0.then(curry3(_get, __, arg1, arg2))
  }
  if (isObject(arg0) && !isArray(arg0)) {
    return _get(arg0, arg1, arg2)
  }
  return curry3(_get, __, arg0, arg1)
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

const _set = function (obj, path, value) {
  if (typeof value == 'function') {
    const actualValue = value(obj)
    if (isPromise(actualValue)) {
      return actualValue.then(
        curry3(setByPath, obj, __, path)
      )
    }
    return setByPath(obj, actualValue, path)
  }
  if (isPromise(value)) {
    return value.then(
      curry3(setByPath, obj, __, path)
    )
  }
  return setByPath(obj, value, path)
}

const set = function (arg0, arg1, arg2) {
  if (arg2 == null) {
    return curry3(_set, __, arg0, arg1)
  }
  if (isPromise(arg0)) {
    return arg0.then(curry3(_set, __, arg1, arg2))
  }
  return _set(arg0, arg1, arg2)
}

// _pick(source Object, keys Array<string>) -> result Object
const _pick = function (source, keys) {
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

const pick = function (arg0, arg1) {
  if (arg1 == null) {
    return curry2(_pick, __, arg0)
  }
  if (isPromise(arg0)) {
    return arg0.then(curry2(_pick, __, arg1))
  }
  return _pick(arg0, arg1)
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

// _omit(source Object, paths Array<string>) -> result Object
const _omit = function (source, paths) {
  const pathsLength = paths.length,
    result = copyDeep(source)
  let pathsIndex = -1
  while (++pathsIndex < pathsLength) {
    deleteByPath(result, paths[pathsIndex])
  }
  return result
}

const omit = function (arg0, arg1) {
  if (arg1 == null) {
    return curry2(_omit, __, arg0)
  }
  if (isPromise(arg0)) {
    return arg0.then(curry2(_omit, __, arg1))
  }
  return _omit(arg0, arg1)
}

const thunkify = (func, ...args) => function thunk() {
  if (areAnyValuesPromises(args)) {
    return promiseAll(args).then(curry2(funcApply, func, __))
  }
  return func(...args)
}

const curry = (func, ...args) => curryArity(func.length, func, args)

curry.arity = function curryArity_(arity, func, ...args) {
  return curryArity(arity, func, args)
}

const rubico = {
  pipe, compose, tap,
  switchCase, tryCatch,
  all, assign, get, set, pick, omit,
  map, filter, flatMap, forEach, reduce, transform,
  and, or, not, some, every,
  eq, gt, lt, gte, lte,
  thunkify, always,
  curry, __,
}

export default rubico
