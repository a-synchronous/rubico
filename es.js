/* rubico v1.5.19
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2020 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const symbolIterator = Symbol.iterator

const symbolAsyncIterator = Symbol.asyncIterator

const globalThisHasBuffer = typeof Buffer == 'function'

const bufferAlloc = globalThisHasBuffer ? Buffer.alloc : function () {}

const objectValues = Object.values

const objectAssign = Object.assign

const objectProto = Object.prototype

const nativeObjectToString = objectProto.toString

const objectToString = x => nativeObjectToString.call(x)

const generatorFunctionTag = '[object GeneratorFunction]'

const asyncGeneratorFunctionTag = '[object AsyncGeneratorFunction]'

const promiseAll = Promise.all.bind(Promise)

const promiseRace = Promise.race.bind(Promise)

const isDefined = value => value != null

const isUndefined = value => typeof value == 'undefined'

const isNull = value => value === null

const isGeneratorFunction = value => objectToString(value) == generatorFunctionTag

const isAsyncGeneratorFunction = value => objectToString(value) == asyncGeneratorFunctionTag

const isIterator = value => value != null
  && typeof value.next == 'function'
  && typeof value[symbolIterator] == 'function'

const isAsyncIterator = value => value != null
  && typeof value.next == 'function'
  && typeof value[symbolAsyncIterator] == 'function'

const isIterable = value => value != null
  && typeof value[symbolIterator] == 'function'

const isAsyncIterable = value => value != null
  && typeof value[symbolAsyncIterator] == 'function'

const isNodeReadStream = value => value != null && typeof value.pipe == 'function'

const isWritable = value => value != null && typeof value.write == 'function'

const isFunction = value => typeof value == 'function'

const isArray = Array.isArray

const isObject = value => value != null && value.constructor == Object

const isSet = value => value != null && value.constructor == Set

const isMap = value => value != null && value.constructor == Map

const isBinary = ArrayBuffer.isView

const isNumber = function (value) {
  return typeof value == 'number'
    || (value != null && value.constructor == Number)
}

const isNaN = Number.isNaN

const isBigInt = x => typeof x == 'bigint'

const isString = value => typeof value == 'string'
  || (value != null && value.constructor == String)

const isPromise = value => value != null && typeof value.then == 'function'

const identity = value => value

const add = (a, b) => a + b

const range = (start, end) => Array.from({ length: end - start }, (x, i) => i + start)

const callPropUnary = (value, property, arg0) => value[property](arg0)

const __ = Symbol('placeholder')

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


const always = value => function getter() { return value }


const thunkify1 = (func, arg0) => () => func(arg0)


const thunkify2 = (func, arg0, arg1) => () => func(arg0, arg1)


const thunkify3 = (func, arg0, arg1, arg2) => () => func(arg0, arg1, arg2)


const thunkifyArgs = (func, args) => () => func(...args)


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
  if (isArray(values)) {
    return _arrayExtend(array, values)
  }
  array.push(values)
  return array
}


const arrayExtendMap = function (
  array, values, valuesMapper, valuesIndex,
) {
  const valuesLength = values.length
  let arrayIndex = array.length - 1
  while (++valuesIndex < valuesLength) {
    array[++arrayIndex] = valuesMapper(values[valuesIndex])
  }
  return array
}


const setAdd = (set, item) => set.add(item)


const setExtend = function (set, values) {
  if (isSet(values)) {
    for (const value of values) {
      set.add(value)
    }
    return set
  }
  return set.add(values)
}


const then = (value, func) => isPromise(value) ? value.then(func) : func(value)


const promiseObjectAll = object => new Promise(function (resolve) {
  const result = {}
  let numPromises = 0
  for (const key in object) {
    const value = object[key]
    if (isPromise(value)) {
      numPromises += 1
      value.then((key => function (res) {
        result[key] = res
        numPromises -= 1
        if (numPromises == 0) resolve(result)
      })(key))
    } else {
      result[key] = value
    }
  }
  if (numPromises == 0) resolve(result)
})


const SyncThenable = function (value) { this.value = value }


SyncThenable.prototype.then = function (func) { return func(this.value) }


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


const pipe = function (funcs) {
  const functionPipeline = funcs.reduce(funcConcat),
    functionComposition = funcs.reduceRight(funcConcat)
  return function pipeline(...args) {
    const firstArg = args[0]
    if (
      typeof firstArg == 'function'
        && !isGeneratorFunction(firstArg)
        && !isAsyncGeneratorFunction(firstArg)
    ) {
      return functionComposition(...args)
    }
    return functionPipeline(...args)
  }
}

// funcs Array<function> -> pipeline function
const pipeSync = funcs => funcs.reduce(funcConcatSync)


pipe.sync = pipeSync


const funcObjectAll = funcs => function objectAllFuncs(...args) {
  const result = {}
  let isAsync = false
  for (const key in funcs) {
    const resultItem = funcs[key](...args)
    if (isPromise(resultItem)) isAsync = true
    result[key] = resultItem
  }
  return isAsync ? promiseObjectAll(result) : result
}


const funcAll = funcs => function allFuncs(...args) {
  const funcsLength = funcs.length,
    result = Array(funcsLength)
  let funcsIndex = -1, isAsync = false
  while (++funcsIndex < funcsLength) {
    const resultItem = funcs[funcsIndex](...args)
    if (isPromise(resultItem)) isAsync = true
    result[funcsIndex] = resultItem
  }
  return isAsync ? promiseAll(result) : result
}


const fork = funcs => isArray(funcs) ? funcAll(funcs) : funcObjectAll(funcs)


const asyncFuncAllSeries = async function (funcs, args, result, funcsIndex) {
  const funcsLength = funcs.length
  while (++funcsIndex < funcsLength) {
    result[funcsIndex] = await funcs[funcsIndex](...args)
  }
  return result
}


const funcAllSeries = funcs => function allFuncsSeries(...args) {
  const funcsLength = funcs.length, result = []
  let funcsIndex = -1
  while (++funcsIndex < funcsLength) {
    const resultItem = funcs[funcsIndex](...args)
    if (isPromise(resultItem)) {
      return resultItem.then(res => {
        result[funcsIndex] = res
        return asyncFuncAllSeries(funcs, args, result, funcsIndex)
      })
    }
    result[funcsIndex] = resultItem
  }
  return result
}


fork.series = funcAllSeries


const assign = function (funcs) {
  const allFuncs = funcObjectAll(funcs)
  return function assignment(value) {
    const result = allFuncs(value)
    return isPromise(result)
      ? result.then(curry2(objectAssign, value, __))
      : ({ ...value, ...result })
  }
}


const tap = func => function tapping(...args) {
  const result = args[0],
    call = func(...args)
  return isPromise(call) ? call.then(always(result)) : result
}


const tapSync = func => function tapping(...args) {
  func(...args)
  return args[0]
}


const thunkConditional = (
  boolean, thunkA, thunkB,
) => boolean ? thunkA() : thunkB()


tap.sync = tapSync


tap.if = (predicate, func) => function tappingIf(...args) {
  const predication = predicate(...args)
  if (isPromise(predication)) {
    return predication.then(curry3(
      thunkConditional, __, thunkifyArgs(tap(func), args), always(args[0])))
  }
  if (predication) {
    func(...args)
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


const asyncFuncSwitch = async function (funcs, args, funcsIndex) {
  const lastIndex = funcs.length - 1
  while ((funcsIndex += 2) < lastIndex) {
    if (await funcs[funcsIndex](...args)) {
      return funcs[funcsIndex + 1](...args)
    }
  }
  return funcs[funcsIndex](...args)
}


const funcApply = (func, args) => func(...args)


const switchCase = funcs => function switchingCases(...args) {
  const lastIndex = funcs.length - 1
  let funcsIndex = -2

  while ((funcsIndex += 2) < lastIndex) {
    const shouldReturnNext = funcs[funcsIndex](...args)
    if (isPromise(shouldReturnNext)) {
      return shouldReturnNext.then(curry3(
        thunkConditional,
        __,
        thunkify1(curry2(funcApply, funcs[funcsIndex + 1], __), args),
        thunkify3(asyncFuncSwitch, funcs, args, funcsIndex)))
    }
    if (shouldReturnNext) {
      return funcs[funcsIndex + 1](...args)
    }
  }
  return funcs[funcsIndex](...args)
}


const arrayMap = function (array, mapper) {
  const arrayLength = array.length,
    result = Array(arrayLength)
  let index = -1,
    isAsync = false

  while (++index < arrayLength) {
    const resultItem = mapper(array[index])
    if (isPromise(resultItem)) {
      isAsync = true
    }
    result[index] = resultItem
  }
  return isAsync ? promiseAll(result) : result
}


const setMap = function (set, mapper) {
  const result = new Set(),
    promises = []
  for (const item of set) {
    const resultItem = mapper(item)
    if (isPromise(resultItem)) {
      promises.push(resultItem.then(curry2(setAdd, result, __)))
    } else {
      result.add(resultItem)
    }
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(always(result))
}

// (map Map, key any, item any) -> map
const mapSetItem = (map, key, item) => map.set(key, item)


const mapMap = function (value, mapper) {
  const result = new Map(),
    promises = []
  for (const [key, item] of value) {
    const resultItem = mapper(item)
    if (isPromise(resultItem)) {
      promises.push(resultItem.then(
        curry3(mapSetItem, result, key, __)))
    } else {
      result.set(key, resultItem)
    }
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(always(result))
}


const stringMap = function (string, mapper) {
  const result = arrayMap(string, mapper)
  return isPromise(result)
    ? result.then(curry3(callPropUnary, __, 'join', ''))
    : result.join('')
}


const objectMap = function (object, mapper) {
  const result = {}
  let isAsync = false

  for (const key in object) {
    const resultItem = mapper(object[key])
    if (isPromise(resultItem)) isAsync = true
    result[key] = resultItem
  }
  return isAsync ? promiseObjectAll(result) : result
}


const generatorFunctionMap = function (generatorFunc, mapper) {
  return function* mappingGeneratorFunc(...args) {
    for (const item of generatorFunc(...args)) {
      yield mapper(item)
    }
  }
}


const MappingIterator = function (iter, mapper) {
  this.iter = iter
  this.mapper = mapper
}

MappingIterator.prototype = {
  [symbolIterator]() {
    return this
  },
  next() {
    const iteration = this.iter.next()
    return iteration.done
      ? iteration
      : { value: this.mapper(iteration.value), done: false }
  },
}


const asyncGeneratorFunctionMap = function (asyncGeneratorFunc, mapper) {
  return async function* mappingAsyncGeneratorFunc(...args) {
    for await (const item of asyncGeneratorFunc(...args)) {
      yield mapper(item)
    }
  }
}


const toIteration = value => ({ value, done: false })


const reducerMap = (reducer, mapper) => function mappingReducer(result, value) {
  const mapped = mapper(value)
  return isPromise(mapped)
    ? mapped.then(curry2(reducer, result, __))
    : reducer(result, mapped)
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

  if (typeof value.next == 'function') {
    return symbolIterator in value
      ? new MappingIterator(value, mapper)
      : new MappingAsyncIterator(value, mapper)
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
  return typeof value.map == 'function' ? value.map(mapper) : mapper(value)
}


const asyncArrayMapSeries = async function (array, mapper, result, index) {
  const arrayLength = array.length
  while (++index < arrayLength) {
    result[index] = await mapper(array[index])
  }
  return result
}


const setProperty = function (object, property, value) {
  object[property] = value
  return object
}


const arrayMapSeries = function (array, mapper) {
  const arrayLength = array.length,
    result = Array(arrayLength)
  let index = -1

  while (++index < arrayLength) {
    const resultItem = mapper(array[index])
    if (isPromise(resultItem)) {
      return resultItem.then(funcConcat(
        curry3(setProperty, result, index, __),
        curry4(asyncArrayMapSeries, array, mapper, __, index)))
    }
    result[index] = resultItem
  }
  return result
}


map.series = mapper => function serialMapping(value) {
  if (isArray(value)) {
    return arrayMapSeries(value, mapper)
  }
  throw new TypeError(`${value} is not an Array`)
}


const asyncArrayMapPool = async function (
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
      return asyncArrayMapPool(
        array, mapper, concurrentLimit, result, index, promises)
    }
    result[index] = resultItem
  }
  return result
}


map.pool = (concurrencyLimit, mapper) => function concurrentPoolMapping(value) {
  if (isArray(value)) {
    return arrayMapPool(value, mapper, concurrencyLimit)
  }
  throw new TypeError(`${value} is not an Array`)
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


map.withIndex = mapper => function mappingWithIndex(value) {
  if (isArray(value)) {
    return arrayMapWithIndex(value, mapper)
  }
  throw new TypeError(`${value} is not an Array`)
}




const arrayFilterByConditions = function (
  array, result, index, conditions,
) {
  const arrayLength = array.length,
    resultPush = result.push.bind(result)
  let conditionsIndex = -1

  while (++index < arrayLength) {
    if (conditions[++conditionsIndex]) {
      resultPush(array[index])
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
    const item = array[index]
    const shouldIncludeItem = predicate(item)
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


const transferPropertyByCondition = function (
  target, source, key, condition,
) {
  if (condition) {
    target[key] = source[key]
  }
}


const objectFilter = function (object, predicate) {
  const result = {},
    promises = []

  for (const key in object) {
    const item = object[key]
    const shouldIncludeItem = predicate(item)
    if (isPromise(shouldIncludeItem)) {
      promises.push(shouldIncludeItem.then(
        curry4(transferPropertyByCondition, result, object, key, __)))
    } else if (shouldIncludeItem) {
      result[key] = item
    }
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(always(result))
}


const generatorFunctionFilter = function (generatorFunction, predicate) {
  return function* filteringGeneratorFunction(...args) {
    for (const item of generatorFunction(...args)) {
      if (predicate(item)) {
        yield item
      }
    }
  }
}


const FilteringIterator = function (iter, predicate) {
  this.iter = iter
  this.predicate = predicate
}

FilteringIterator.prototype = {
  [symbolIterator]() {
    return this
  },
  next() {
    const thisIterNext = this.iter.next.bind(this.iter),
      thisPredicate = this.predicate
    let iteration = this.iter.next()

    while (!iteration.done) {
      const { value } = iteration
      if (thisPredicate(value)) {
        return { value, done: false }
      }
      iteration = thisIterNext()
    }
    return iteration
  },
}


const asyncGeneratorFunctionFilter = function (asyncGeneratorFunction, predicate) {
  return async function* filteringAsyncGeneratorFunction(...args) {
    for await (const item of asyncGeneratorFunction(...args)) {
      const shouldIncludeItem = predicate(item)
      if (
        isPromise(shouldIncludeItem)
          ? await shouldIncludeItem
          : shouldIncludeItem
      ) {
        yield item
      }
    }
  }
}


const FilteringAsyncIterator = function (iter, predicate) {
  this.iter = iter
  this.predicate = predicate
}

FilteringAsyncIterator.prototype = {
  [symbolAsyncIterator]() {
    return this
  },
  async next() {
    const thisIterNext = this.iter.next.bind(this.iter),
      thisPredicate = this.predicate
    let iteration = await thisIterNext()

    while (!iteration.done) {
      const { value } = iteration
      const shouldIncludeItem = thisPredicate(value)
      if (
        isPromise(shouldIncludeItem)
          ? await shouldIncludeItem
          : shouldIncludeItem
      ) {
        return { value, done: false }
      }
      iteration = await thisIterNext()
    }
    return iteration
  },
}


const reducerFilterByCondition = (
  reducer, result, item, condition,
) => condition ? reducer(result, item) : result


const reducerFilter = (
  reducer, predicate,
) => function filteringReducer(result, item) {
  const shouldInclude = predicate(item)
  return isPromise(shouldInclude)
    ? shouldInclude.then(
      curry4(reducerFilterByCondition, reducer, result, item, __))
    : shouldInclude ? reducer(result, item) : result
}


const filter = predicate => function filtering(value) {
  if (isArray(value)) {
    return arrayFilter(value, predicate)
  }
  if (isFunction(value)) {
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

  if (typeof value.next == 'function') {
    return symbolIterator in value
      ? new FilteringIterator(value, predicate)
      : new FilteringAsyncIterator(value, predicate)
  }
  if (value.constructor == Object) {
    return objectFilter(value, predicate)
  }
  return typeof value.filter == 'function' ? value.filter(predicate) : value
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
    const item = array[index]
    const shouldIncludeItem = predicate(item, index, array)
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


filter.withIndex = predicate => function filteringWithIndex(value) {
  if (isArray(value)) {
    return arrayFilterWithIndex(value, predicate)
  }
  throw new TypeError(`${value} is not an Array`)
}


const asyncArrayReduce = async function (array, reducer, result, index) {
  const arrayLength = array.length
  while (++index < arrayLength) {
    result = await reducer(result, array[index])
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
    result = reducer(result, array[index])
    if (isPromise(result)) {
      return result.then(
        curry4(asyncArrayReduce, array, reducer, __, index))
    }
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


const asyncGeneratorFunctionReduce = (
  asyncGeneratorFunc, reducer, result,
) => funcConcat(
  asyncGeneratorFunc,
  curry3(asyncIteratorReduce, __, reducer, result))


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
      return result.then(curry3(asyncIteratorReduce, iterator, reducer, __))
    }
    iteration = iterator.next()
  }
  return result
}


const generatorFunctionReduce = (
  generatorFunc, reducer, result,
) => funcConcat(
  generatorFunc,
  curry3(iteratorReduce, __, reducer, result))


const reducerConcat = function (reducerA, reducerB) {
  return function pipedReducer(result, item) {
    const intermediate = reducerA(result, item)
    return isPromise(intermediate)
      ? intermediate.then(curry2(reducerB, __, item))
      : reducerB(intermediate, item)
  }
}




const tacitGenericReduce = (
  reducer, result,
) => function reducing(...args) {
  return genericReduce(args, reducer, result)
}


var genericReduce = function (args, reducer, result) {
  const collection = args[0]
  if (isArray(collection)) {
    return arrayReduce(collection, reducer, result)
  }
  if (collection == null) {
    return result === undefined
      ? reducer(collection)
      : reducer(result, collection)
  }

  if (typeof collection.next == 'function') {
    return symbolIterator in collection
      ? iteratorReduce(collection, reducer, result)
      : asyncIteratorReduce(collection, reducer, result)
  }
  if (typeof collection[symbolIterator] == 'function') {
    return iteratorReduce(
      collection[symbolIterator](), reducer, result)
  }
  if (typeof collection[symbolAsyncIterator] == 'function') {
    return asyncIteratorReduce(
      collection[symbolAsyncIterator](), reducer, result)
  }
  if (isFunction(collection)) {
    if (isGeneratorFunction(collection)) {
      return generatorFunctionReduce(collection, reducer, result)
    }
    if (isAsyncGeneratorFunction(collection)) {
      return asyncGeneratorFunctionReduce(collection, reducer, result)
    }
    return tacitGenericReduce(
      args.length == 0 ? reducer : args.reduce(reducerConcat, reducer),
      result)
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
    return arrayReduce(objectValues(collection), reducer, result)
  }
  return result === undefined
    ? reducer(collection)
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
  return tacitGenericReduce(reducer, init)
}


const emptyTransform = function (args, transducer, result) {
  const nil = genericReduce(args, transducer(identity), null)
  return isPromise(nil) ? nil.then(always(result)) : result
}


const _binaryExtend = function (typedArray, array) {
  const offset = typedArray.length
  const result = new typedArray.constructor(offset + array.length)
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


const streamAppender = stream => function appender(
  chunk, encoding, callback,
) {
  stream.write(chunk, encoding, callback)
  return stream
}


const streamExtendExecutor = (
  resultStream, stream,
) => function executor(resolve, reject) {
  stream.on('data', streamAppender(resultStream))
  stream.on('end', thunkify1(resolve, resultStream))
  stream.on('error', reject)
}


const _streamExtend = (
  resultStream, stream,
) => new Promise(streamExtendExecutor(resultStream, stream))


const streamExtend = function (stream, values) {
  if (isNodeReadStream(values)) {
    return _streamExtend(stream, values)
  }
  stream.write(values)
  return stream
}


const callConcat = function (object, values) {
  return object.concat(values)
}


const genericTransform = function (args, transducer, result) {
  if (isArray(result)) {
    return genericReduce(args, transducer(arrayExtend), result)
  }
  if (isBinary(result)) {
    const intermediateArray = genericReduce(args, transducer(arrayExtend), [])
    return isPromise(intermediateArray)
      ? intermediateArray.then(curry2(_binaryExtend, result, __))
      : _binaryExtend(result, intermediateArray)
  }
  if (result == null) {
    return emptyTransform(args, transducer, result)
  }

  const resultConstructor = result.constructor
  if (typeof result == 'string' || resultConstructor == String) {
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
  return emptyTransform(args, transducer, result)
}


const transform = function (transducer, init) {
  if (isFunction(init)) {
    return function reducing(...args) {
      const result = init(...args)
      return isPromise(result)
        ? result.then(curry3(genericTransform, args, transducer, __))
        : genericTransform(args, transducer, result)
    }
  }
  return function reducing(...args) {
    return genericTransform(args, transducer, init)
  }
}


const flatteningTransducer = concat => function flatteningReducer(
  result, item,
) {
  return genericReduce([item], concat, result)
}


const asyncIteratorForEach = async function (asyncIterator, callback) {
  for await (const item of asyncIterator) {
    callback(item)
  }
}


const arrayPush = function (array, item) {
  array.push(item)
  return array
}


const monadArrayFlatten = function (array) {
  const length = array.length,
    promises = [],
    result = [],
    resultPushReducer = (_, subItem) => result.push(subItem),
    resultPush = curry2(arrayPush, result, __),
    getResult = () => result
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
    } else if (typeof item[symbolIterator] == 'function') {
      for (const subItem of item) {
        result.push(subItem)
      }
    } else if (typeof item[symbolAsyncIterator] == 'function') {
      promises.push(
        asyncIteratorForEach(item[symbolAsyncIterator](), resultPush))
    } else if (typeof item.chain == 'function') {
      const monadValue = item.chain(identity)
      isPromise(monadValue)
        ? promises.push(monadValue.then(resultPush))
        : result.push(monadValue)
    } else if (typeof item.flatMap == 'function') {
      const monadValue = item.flatMap(identity)
      isPromise(monadValue)
        ? promises.push(monadValue.then(resultPush))
        : result.push(monadValue)
    } else if (typeof item.reduce == 'function') {
      const folded = item.reduce(resultPushReducer, null)
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
    : promiseAll(promises).then(getResult)
}


const arrayFlatMap = function (array, flatMapper) {
  const monadArray = arrayMap(array, flatMapper)
  return isPromise(monadArray)
    ? monadArray.then(monadArrayFlatten)
    : monadArrayFlatten(monadArray)
}


const monadObjectFlatten = function (object) {
  const promises = [],
    result = {},
    resultAssignReducer = (_, subItem) => objectAssign(result, subItem),
    resultAssign = curry2(objectAssign, result, __),
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
    ? monadObject.then(monadObjectFlatten)
    : monadObjectFlatten(monadObject)
}


const monadSetFlatten = function (set) {
  const size = set.size,
    promises = [],
    result = new Set(),
    resultAddReducer = (_, subItem) => result.add(subItem),
    resultAdd = curry2(setAdd, result, __),
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
  return promises.length == 0
    ? result
    : promiseAll(promises).then(getResult)
}


const setFlatMap = function (set, flatMapper) {
  const monadSet = setMap(set, flatMapper)
  return isPromise(monadSet)
    ? monadSet.then(monadSetFlatten)
    : monadSetFlatten(monadSet)
}


const arrayJoin = (array, delimiter) => array.join(delimiter)


const monadArrayFlattenToString = funcConcat(
  monadArrayFlatten, curry2(arrayJoin, __, ''))


const stringFlatMap = function (string, flatMapper) {
  const monadArray = arrayMap(string, flatMapper)
  return isPromise(monadArray)
    ? monadArray.then(monadArrayFlattenToString)
    : monadArrayFlattenToString(monadArray)
}


const streamWrite = function (stream, chunk, encoding, callback) {
  stream.write(chunk, encoding, callback)
  return stream
}


const streamFlatExtend = function (stream, item) {
  const resultStreamWrite = curry2(streamWrite, stream, __),
    resultStreamWriteReducer = (_, subItem) => stream.write(subItem),
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
      const streamFlatExtendOperation = streamFlatExtend(stream, monad)
      if (isPromise(streamFlatExtendOperation)) {
        const selfDeletingPromise = streamFlatExtendOperation.then(
          () => promises.delete(selfDeletingPromise))
        promises.add(selfDeletingPromise)
      }
    }
  }
  while (promises.size > 0) {
    await promiseRace(promises)
  }
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


const monadArrayFlattenToBinary = function (array, result) {
  const flattened = monadArrayFlatten(array)
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
    ? monadArray.then(curry2(monadArrayFlattenToBinary, __, result))
    : monadArrayFlattenToBinary(monadArray, result)
}


const generatorFunctionFlatMap = (
  generatorFunction, flatMapper,
) => function* flatMappingGeneratorFunction(...args) {
  yield* new FlatMappingIterator(generatorFunction(...args), flatMapper)
}


const reducerFlatMap = (
  reducer, flatMapper,
) => function flatMappingReducer(result, value) {
  const monad = flatMapper(value)
  return isPromise(monad)
    ? monad.then(tacitGenericReduce(
      flatteningTransducer(reducer),
      result))
    : genericReduce([monad],
      flatteningTransducer(reducer),
      result)
}


const FlatMappingIterator = function (iterator, flatMapper) {
  this.iterator = iterator
  this.flatMapper = flatMapper
  this.buffer = []
  this.bufferIndex = Infinity
}

FlatMappingIterator.prototype = {
  [symbolIterator]() {
    return this
  },

  
  next() {
    if (this.bufferIndex < this.buffer.length) {
      const value = this.buffer[this.bufferIndex]
      this.bufferIndex += 1
      return { value, done: false }
    }

    const iteration = this.iterator.next()
    if (iteration.done) {
      return iteration
    }
    const monadAsArray = genericReduce(
      [this.flatMapper(iteration.value)],
      arrayPush,
      []) // this will always have at least one item
    if (monadAsArray.length > 1) {
      this.buffer = monadAsArray
      this.bufferIndex = 1
    }
    return {
      value: monadAsArray[0],
      done: false,
    }
  },
}


const FlatMappingAsyncIterator = function (asyncIterator, flatMapper) {
  this.asyncIterator = asyncIterator
  this.flatMapper = flatMapper
  this.buffer = []
  this.bufferIndex = 0
  this.promises = new Set()
}

FlatMappingAsyncIterator.prototype = {
  [symbolAsyncIterator]() {
    return this
  },

  toString() {
    return '[object FlatMappingAsyncIterator]'
  },

  
  async next() {
    const { buffer, bufferIndex } = this
    if (bufferIndex < buffer.length) {
      const value = buffer[bufferIndex]
      delete buffer[bufferIndex]
      this.bufferIndex += 1
      return { value, done: false }
    }

    const iteration = await this.asyncIterator.next()
    if (iteration.done) {
      if (this.promises.size == 0) {
        return iteration
      }
      await promiseRace(this.promises)
      return this.next()
    }
    let monad = this.flatMapper(iteration.value)
    if (isPromise(monad)) {
      monad = await monad
    }
    // this will always load at least one item
    const bufferLoading = genericReduce([monad], arrayPush, this.buffer)
    if (isPromise(bufferLoading)) {
      const promise = bufferLoading.then(() => this.promises.delete(promise))
      this.promises.add(promise)
    }
    return this.next()
  },
}


const asyncGeneratorFunctionFlatMap = (
  asyncGeneratorFunction, flatMapper,
) => async function* flatMappingAsyncGeneratorFunction(...args) {
  yield* new FlatMappingAsyncIterator(
    asyncGeneratorFunction(...args), flatMapper)
}


const flatMap = flatMapper => function flatMapping(value) {
  if (isArray(value)) {
    return arrayFlatMap(value, flatMapper)
  }
  if (isFunction(value)) {
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
    return value
  }

  if (typeof value.next == 'function') {
    return symbolIterator in value
      ? new FlatMappingIterator(value, flatMapper)
      : new FlatMappingAsyncIterator(value, flatMapper)
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

// a[0].b.c
const pathStringSplitRegex = /[.|[|\]]+/


const pathStringSplit = function (pathString) {
  const pathStringLastIndex = pathString.length - 1,
    firstChar = pathString[0],
    lastChar = pathString[pathStringLastIndex],
    isFirstCharLeftBracket = firstChar == '[',
    isLastCharRightBracket = lastChar == ']'

  if (isFirstCharLeftBracket && isLastCharRightBracket) {
    return pathString.slice(1, pathStringLastIndex).split(pathStringSplitRegex)
  } else if (isFirstCharLeftBracket) {
    return pathString.slice(1).split(pathStringSplitRegex)
  } else if (isLastCharRightBracket) {
    return pathString.slice(0, pathStringLastIndex).split(pathStringSplitRegex)
  }
  return pathString.split(pathStringSplitRegex)
}

// memoized version of pathStringSplit, max cache size 500
const memoizedCappedPathStringSplit = memoizeCappedUnary(pathStringSplit, 500)


const pathToArray = function (path) {
  if (typeof path == 'string' || path.constructor == String) {
    return memoizedCappedPathStringSplit(path)
  }
  if (isArray(path)) {
    return path
  }
  return [path]
}


const getByPath = function (object, path) {
  const pathArray = pathToArray(path),
    pathArrayLength = pathArray.length
  let index = -1,
    result = object
  while (++index < pathArrayLength) {
    result = result[pathArray[index]]
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


const pick = keys => function picking(source) {
  if (source == null) {
    return source
  }

  const keysLength = keys.length,
    result = {}
  let keysIndex = -1
  while (++keysIndex < keysLength) {
    const key = keys[keysIndex],
      value = source[key]
    if (value != null) {
      result[key] = value
    }
  }
  return result
}


const omit = keys => function omitting(source) {
  if (source == null) {
    return source
  }

  const keysLength = keys.length,
    result = { ...source }
  let keysIndex = -1
  while (++keysIndex < keysLength) {
    delete result[keys[keysIndex]]
  }
  return result
}


const promiseInFlight = function (basePromise) {
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
      promisesInFlight.add(promiseInFlight(predication))
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
        array, predicate, index, new Set([promiseInFlight(predication)]))
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
      promisesInFlight.add(promiseInFlight(predication))
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
        iterator, predicate, new Set([promiseInFlight(predication)]))
    }
    if (predication) {
      return true
    }
  }
  return false
}


const objectValuesGenerator = function* (object) {
  for (const key in object) {
    yield object[key]
  }
}



const _foldableAnyReducer = (predicate, result, item) => result ? true : predicate(item)


const foldableAnyReducer = predicate => function anyReducer(result, item) {
  return result === true ? true
    : isPromise(result) ? result.then(
      curry3(_foldableAnyReducer, predicate, __, item))
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
    return value.reduce(foldableAnyReducer(predicate), false)
  }
  if (value.constructor == Object) {
    return iteratorAny(objectValuesGenerator(value), predicate)
  }
  return !!predicate(value)
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
      if (!predication) {
        return false
      }
    }
    const predication = predicate(iteration.value)
    if (isPromise(predication)) {
      promisesInFlight.add(promiseInFlight(predication))
    } else if (!predication) {
      return false
    }
    iteration = iterator.next()
    if (isPromise(iteration)) {
      iteration = await iteration
    }
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


const _foldableAllReducer = (predicate, result, item) => result ? predicate(item) : false


const foldableAllReducer = predicate => function allReducer(result, item) {
  return result === false ? false
    : isPromise(result) ? result.then(
      curry3(_foldableAllReducer, predicate, __, item))
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
    return iteratorAll(value, predicate)
  }
  if (typeof value[symbolAsyncIterator] == 'function') {
    return asyncIteratorAll(value, predicate, new Set())
  }
  if (typeof value.reduce == 'function') {
    return value.reduce(foldableAllReducer(predicate), true)
  }
  if (value.constructor == Object) {
    return iteratorAll(objectValuesGenerator(value), predicate)
  }
  return !!predicate(value)
}

// true -> false
const _not = value => !value


const not = func => function logicalInverter(...args) {
  const boolean = func(...args)
  return isPromise(boolean) ? boolean.then(_not) : !boolean
}


const notSync = func => function notSync(...args) {
  return !func(...args)
}


not.sync = notSync


const asyncAnd = async function (predicates, value) {
  const length = predicates.length
  let index = -1
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

// handles the first predication before asyncAnd
const _asyncAndInterlude = (
  predicates, value, firstPredication,
) => firstPredication ? asyncAnd(predicates, value) : false


const and = predicates => function allPredicates(value) {
  const length = predicates.length,
    promises = []
  let index = -1

  while (++index < length) {
    const predication = predicates[index](value)
    if (isPromise(predication)) {
      return predication.then(curry3(_asyncAndInterlude, predicates, value, __))
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


const spread2 = func => function spreading2([arg0, arg1]) {
  return func(arg0, arg1)
}


const strictEqual = (a, b) => a === b


const eq = function (left, right) {
  const isLeftResolver = typeof left == 'function',
    isRightResolver = typeof right == 'function'
  if (isLeftResolver && isRightResolver) {
    return function strictEqualBy(value) {
      const leftResolve = left(value),
        rightResolve = right(value)
      const isLeftPromise = isPromise(leftResolve),
        isRightPromise = isPromise(rightResolve)
      if (isLeftPromise && isRightPromise) {
        return promiseAll(
          [leftResolve, rightResolve]).then(spread2(strictEqual))
      } else if (isLeftPromise) {
        return leftResolve.then(curry2(strictEqual, __, rightResolve))
      } else if (isRightPromise) {
        return rightResolve.then(curry2(strictEqual, leftResolve, __))
      }
      return leftResolve === rightResolve
    }
  }

  if (isLeftResolver) {
    return function strictEqualBy(value) {
      const leftResolve = left(value)
      return isPromise(leftResolve)
        ? leftResolve.then(curry2(strictEqual, __, right))
        : leftResolve === right
    }
  }
  if (isRightResolver) {
    return function strictEqualBy(value) {
      const rightResolve = right(value)
      return isPromise(rightResolve)
        ? rightResolve.then(curry2(strictEqual, left, __))
        : left === rightResolve
    }
  }
  return always(left === right)
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
  return always(left > right)
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
    return function strictEqualBy(value) {
      const rightResolve = right(value)
      return isPromise(rightResolve)
        ? rightResolve.then(curry2(lessThan, left, __))
        : left < rightResolve
    }
  }
  return always(left < right)
}


const greaterThanOrEqualTo = (left, right) => left >= right


const gte = function (left, right) {
  const isLeftResolver = typeof left == 'function',
    isRightResolver = typeof right == 'function'
  if (isLeftResolver && isRightResolver) {
    return function greaterThanOrEqualToBy(value) {
      const leftResolve = left(value),
        rightResolve = right(value)
      const isLeftPromise = isPromise(leftResolve),
        isRightPromise = isPromise(rightResolve)
      if (isLeftPromise && isRightPromise) {
        return promiseAll(
          [leftResolve, rightResolve]).then(spread2(greaterThanOrEqualTo))
      } else if (isLeftPromise) {
        return leftResolve.then(curry2(greaterThanOrEqualTo, __, rightResolve))
      } else if (isRightPromise) {
        return rightResolve.then(curry2(greaterThanOrEqualTo, leftResolve, __))
      }
      return leftResolve >= rightResolve
    }
  }

  if (isLeftResolver) {
    return function greaterThanOrEqualToBy(value) {
      const leftResolve = left(value)
      return isPromise(leftResolve)
        ? leftResolve.then(curry2(greaterThanOrEqualTo, __, right))
        : leftResolve >= right
    }
  }
  if (isRightResolver) {
    return function strictEqualBy(value) {
      const rightResolve = right(value)
      return isPromise(rightResolve)
        ? rightResolve.then(curry2(greaterThanOrEqualTo, left, __))
        : left >= rightResolve
    }
  }
  return always(left >= right)
}


const lessThanOrEqualTo = (left, right) => left <= right


const lte = function (left, right) {
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
          [leftResolve, rightResolve]).then(spread2(lessThanOrEqualTo))
      } else if (isLeftPromise) {
        return leftResolve.then(curry2(lessThanOrEqualTo, __, rightResolve))
      } else if (isRightPromise) {
        return rightResolve.then(curry2(lessThanOrEqualTo, leftResolve, __))
      }
      return leftResolve <= rightResolve
    }
  }

  if (isLeftResolver) {
    return function lessThanBy(value) {
      const leftResolve = left(value)
      return isPromise(leftResolve)
        ? leftResolve.then(curry2(lessThanOrEqualTo, __, right))
        : leftResolve <= right
    }
  }
  if (isRightResolver) {
    return function strictEqualBy(value) {
      const rightResolve = right(value)
      return isPromise(rightResolve)
        ? rightResolve.then(curry2(lessThanOrEqualTo, left, __))
        : left <= rightResolve
    }
  }
  return always(left <= right)
}

export {
  pipe, fork, assign,
  tap, tryCatch, switchCase,
  map, filter, reduce, transform, flatMap,
  any, all, and, or, not,
  eq, gt, lt, gte, lte,
  get, pick, omit,
}

export default {
  pipe, fork, assign,
  tap, tryCatch, switchCase,
  map, filter, reduce, transform, flatMap,
  any, all, and, or, not,
  eq, gt, lt, gte, lte,
  get, pick, omit,
}
