/**
 * rubico v2.6.2
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2024 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const isPromise = value => value != null && typeof value.then == 'function'

const funcConcat = (
  funcA, funcB,
) => function pipedFunction(...args) {
  const intermediate = funcA(...args)
  return isPromise(intermediate)
    ? intermediate.then(funcB)
    : funcB(intermediate)
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

const isObject = value => {
  if (value == null) {
    return false
  }

  const typeofValue = typeof value
  return (typeofValue == 'object') || (typeofValue == 'function')
}

const promiseAll = Promise.all.bind(Promise)

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

const always = value => function getter() { return value }

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

const objectSet = function (object, property, value) {
  object[property] = value
  return object
}

const arrayMapSeriesAsync = async function (
  array, mapper, result, index,
) {
  const arrayLength = array.length
  while (++index < arrayLength) {
    const resultItem = mapper(array[index], index)
    result[index] = isPromise(resultItem) ? await resultItem : resultItem
  }
  return result
}

const arrayMapSeries = function (array, mapper) {
  const arrayLength = array.length,
    result = Array(arrayLength)
  let index = -1

  while (++index < arrayLength) {
    const resultItem = mapper(array[index], index)
    if (isPromise(resultItem)) {
      return resultItem.then(funcConcat(
        curry3(objectSet, result, index, __),
        curry4(arrayMapSeriesAsync, array, mapper, __, index)))
    }
    result[index] = resultItem
  }
  return result
}

const stringMapSeries = function (string, mapper) {
  const result = arrayMapSeries(string, mapper)
  return isPromise(result)
    ? result.then(curry3(callPropUnary, __, 'join', ''))
    : result.join('')
}

const thunkify4 = (func, arg0, arg1, arg2, arg3) => function thunk() {
  return func(arg0, arg1, arg2, arg3)
}

// _objectMapSeriesAsync(
//   object Object,
//   f function,
//   result Object,
//   doneKeys Object
// ) -> Promise<object>
const _objectMapSeriesAsync = async function (object, f, result, doneKeys) {
  for (const key in object) {
    if (key in doneKeys) {
      continue
    }
    let resultItem = f(object[key])
    if (isPromise(resultItem)) {
      resultItem = await resultItem
    }
    result[key] = resultItem
  }
  return result
}

const objectMapSeries = function (object, f) {
  const result = {}
  const doneKeys = {}
  for (const key in object) {
    doneKeys[key] = true
    const resultItem = f(object[key], key, object)
    if (isPromise(resultItem)) {
      return resultItem.then(funcConcat(
        curry3(objectSet, result, key, __),
        thunkify4(_objectMapSeriesAsync, object, f, result, doneKeys),
      ))
    }
    result[key] = resultItem
  }
  return result
}

const thunkify3 = (func, arg0, arg1, arg2) => function thunk() {
  return func(arg0, arg1, arg2)
}

const setAdd = function (set, value) {
  set.add(value)
  return set
}

// _setMapSeriesAsync(
//   iterator Iterator,
//   f function,
//   result Set,
// ) -> Promise<Set>
const _setMapSeriesAsync = async function (iterator, f, result) {
  let iteration = iterator.next()
  while (!iteration.done) {
    let resultItem = f(iteration.value)
    if (isPromise(resultItem)) {
      resultItem = await resultItem
    }
    result.add(resultItem)
    iteration = iterator.next()
  }
  return result
}

const setMapSeries = function (set, f) {
  const result = new Set()
  const iterator = set[symbolIterator]()
  let iteration = iterator.next()
  while (!iteration.done) {
    const resultItem = f(iteration.value)
    if (isPromise(resultItem)) {
      return resultItem.then(funcConcat(
        curry2(setAdd, result, __),
        thunkify3(_setMapSeriesAsync, iterator, f, result),
      ))
    }
    result.add(resultItem)
    iteration = iterator.next()
  }
  return result
}

const mapSet = function setting(source, key, value) {
  return source.set(key, value)
}

// _mapMapSeriesAsync(
//   iterator Iterator,
//   f function,
//   result Map,
// ) -> Promise<Map>
const _mapMapSeriesAsync = async function (iterator, f, result) {
  let iteration = iterator.next()
  while (!iteration.done) {
    let resultItem = f(iteration.value[1])
    if (isPromise(resultItem)) {
      resultItem = await resultItem
    }
    result.set(iteration.value[0], resultItem)
    iteration = iterator.next()
  }
  return result
}

const mapMapSeries = function (map, f) {
  const result = new Map()
  const iterator = map[symbolIterator]()
  let iteration = iterator.next()
  while (!iteration.done) {
    const key = iteration.value[0]
    const resultItem = f(iteration.value[1])
    if (isPromise(resultItem)) {
      return resultItem.then(funcConcat(
        curry3(mapSet, result, key, __),
        thunkify3(_mapMapSeriesAsync, iterator, f, result),
      ))
    }
    result.set(key, resultItem)
    iteration = iterator.next()
  }
  return result
}

const tapSync = func => function tapping(...args) {
  func(...args)
  return args[0]
}

const promiseRace = Promise.race.bind(Promise)

const arrayMapPoolAsync = async function (
  array, f, concurrencyLimit, result, index, promises,
) {
  const arrayLength = array.length
  while (++index < arrayLength) {
    if (promises.size >= concurrencyLimit) {
      await promiseRace(promises)
    }
    const resultItem = f(array[index])
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

const arrayMapPool = function (array, concurrency, f) {
  const arrayLength = array.length,
    result = Array(arrayLength)
  let index = -1
  while (++index < arrayLength) {
    const resultItem = f(array[index])
    if (isPromise(resultItem)) {
      const promises = new Set(),
        selfDeletingPromise = resultItem.then(
          tapSync(() => promises.delete(selfDeletingPromise)))
      promises.add(selfDeletingPromise)
      result[index] = selfDeletingPromise
      return arrayMapPoolAsync(
        array, f, concurrency, result, index, promises)
    }
    result[index] = resultItem
  }
  return result
}

const stringMapPool = function (s, concurrency, f) {
  const result = arrayMapPool(s, concurrency, f)
  return isPromise(result)
    ? result.then(curry3(callPropUnary, __, 'join', ''))
    : result.join('')
}

const _setMapPoolAsync = async function (
  s, iterator, concurrency, f, result, promises,
) {
  let iteration = iterator.next()
  while (!iteration.done) {
    if (promises.size >= concurrency) {
      await promiseRace(promises)
    }
    const resultItem = f(iteration.value, iteration.value, s)
    if (isPromise(resultItem)) {
      const selfDeletingPromise = resultItem.then(resolvedValue => {
        promises.delete(selfDeletingPromise)
        result.add(resolvedValue)
      })
      promises.add(selfDeletingPromise)
    } else {
      result.add(resultItem)
    }
    iteration = iterator.next()
  }
  if (promises.size > 0) {
    await promiseAll(promises)
  }
  return result
}

const setMapPool = function (s, concurrency, f) {
  const result = new Set()
  const iterator = s[symbolIterator]()
  let iteration = iterator.next()
  while (!iteration.done) {
    const resultItem = f(iteration.value, iteration.value, s)
    if (isPromise(resultItem)) {
      const promises = new Set()
      const selfDeletingPromise = resultItem.then(resolvedValue => {
        promises.delete(selfDeletingPromise)
        result.add(resolvedValue)
      })
      promises.add(selfDeletingPromise)
      return _setMapPoolAsync(s, iterator, concurrency, f, result, promises)
    }
    result.add(resultItem)
    iteration = iterator.next()
  }
  return result
}

const _mapMapPoolAsync = async function (
  m, iterator, concurrency, f, result, promises,
) {
  let iteration = iterator.next()
  while (!iteration.done) {
    if (promises.size >= concurrency) {
      await promiseRace(promises)
    }
    const key = iteration.value[0]
    const resultItem = f(iteration.value[1], key, m)
    if (isPromise(resultItem)) {
      result.set(key, resultItem)
      const selfDeletingPromise = resultItem.then(resolvedValue => {
        promises.delete(selfDeletingPromise)
        result.set(key, resolvedValue)
      })
      promises.add(selfDeletingPromise)
    } else {
      result.set(key, resultItem)
    }
    iteration = iterator.next()
  }
  if (promises.size > 0) {
    await promiseAll(promises)
  }
  return result
}

const mapMapPool = function (m, concurrency, f) {
  const result = new Map()
  const iterator = m[symbolIterator]()
  let iteration = iterator.next()
  while (!iteration.done) {
    const key = iteration.value[0]
    const resultItem = f(iteration.value[1], key, m)
    if (isPromise(resultItem)) {
      const promises = new Set()
      result.set(key, resultItem)
      const selfDeletingPromise = resultItem.then(resolvedValue => {
        promises.delete(selfDeletingPromise)
        result.set(key, resolvedValue)
      })
      promises.add(selfDeletingPromise)
      return _mapMapPoolAsync(m, iterator, concurrency, f, result, promises)
    }
    result.set(key, resultItem)
    iteration = iterator.next()
  }
  return result
}

const _objectMapPoolAsync = async function (
  o, concurrency, f, result, doneKeys, promises,
) {
  for (const key in o) {
    if (key in doneKeys) {
      continue
    }
    if (promises.size >= concurrency) {
      await promiseRace(promises)
    }
    const resultItem = f(o[key], key, o)
    if (isPromise(resultItem)) {
      result[key] = resultItem
      const selfDeletingPromise = resultItem.then(resolvedValue => {
        promises.delete(selfDeletingPromise)
        result[key] = resolvedValue
      })
      promises.add(selfDeletingPromise)
    } else {
      result[key] = resultItem
    }
  }
  if (promises.size > 0) {
    await promiseAll(promises)
  }
  return result
}

const objectMapPool = function (o, concurrency, f) {
  const result = {}
  const doneKeys = {}
  for (const key in o) {
    doneKeys[key] = true
    const resultItem = f(o[key], key, o)
    if (isPromise(resultItem)) {
      const promises = new Set()
      result[key] = resultItem
      const selfDeletingPromise = resultItem.then(resolvedValue => {
        promises.delete(selfDeletingPromise)
        result[key] = resolvedValue
      })
      promises.add(selfDeletingPromise)
      return _objectMapPoolAsync(o, concurrency, f, result, doneKeys, promises)
    }
    result[key] = resultItem
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

const map = function (arg0, arg1) {
  if (arg1 == null) {
    return curry2(_map, __, arg0)
  }
  return isPromise(arg0)
    ? arg0.then(curry2(_map, __, arg1))
    : _map(arg0, arg1)
}

// _mapEntries(value Object|Map, mapper function) -> Object|Map
const _mapEntries = (value, mapper) => {
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

map.entries = function mapEntries(arg0, arg1) {
  if (arg1 == null) {
    return curry2(_mapEntries, __, arg0)
  }
  return isPromise(arg0)
    ? arg0.then(curry2(_mapEntries, __, arg1))
    : _mapEntries(arg0, arg1)
}

const _mapSeries = function (collection, f) {
  if (isArray(collection)) {
    return arrayMapSeries(collection, f)
  }
  if (collection == null) {
    throw new TypeError(`invalid collection ${collection}`)
  }

  if (typeof collection == 'string' || collection.constructor == String) {
    return stringMapSeries(collection, f)
  }
  if (collection.constructor == Set) {
    return setMapSeries(collection, f)
  }
  if (collection.constructor == Map) {
    return mapMapSeries(collection, f)
  }
  if (collection.constructor == Object) {
    return objectMapSeries(collection, f)
  }
  throw new TypeError(`invalid collection ${collection}`)
}

map.series = function mapSeries(arg0, arg1) {
  if (arg1 == null) {
    return curry2(_mapSeries, __, arg0)
  }
  return isPromise(arg0)
    ? arg0.then(curry2(_mapSeries, __, arg1))
    : _mapSeries(arg0, arg1)
}

const _mapPool = function (collection, concurrency, f) {
  if (isArray(collection)) {
    return arrayMapPool(collection, concurrency, f)
  }
  if (collection == null) {
    throw new TypeError(`invalid collection ${collection}`)
  }
  if (typeof collection == 'string' || collection.constructor == String) {
    return stringMapPool(collection, concurrency, f)
  }
  if (collection.constructor == Set) {
    return setMapPool(collection, concurrency, f)
  }
  if (collection.constructor == Map) {
    return mapMapPool(collection, concurrency, f)
  }
  if (collection.constructor == Object) {
    return objectMapPool(collection, concurrency, f)
  }
  throw new TypeError(`invalid collection ${collection}`)
}

map.pool = function mapPool(arg0, arg1, arg2) {
  if (arg2 == null) {
    return curry3(_mapPool, __, arg0, arg1)
  }
  return isPromise(arg0)
    ? arg0.then(curry3(_mapPool, __, arg1, arg2))
    : _mapPool(arg0, arg1, arg2)
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

// _get(object Object, path string, defaultValue function|any)
const _get = function (object, path, defaultValue) {
  const result = object == null ? undefined : getByPath(object, path)
  return result === undefined
    ? typeof defaultValue == 'function' ? defaultValue(object) : defaultValue
    : result
}

const get = function (arg0, arg1, arg2) {
  if (typeof arg0 == 'string' || typeof arg0 == 'number' || isArray(arg0)) {
    return curry3(_get, __, arg0, arg1)
  }
  if (isPromise(arg0)) {
    return arg0.then(curry3(_get, __, arg1, arg2))
  }
  return _get(arg0, arg1, arg2)
}

const pluck = function (...args) {
  const path = args.pop()
  const getter = get(path)
  if (args.length == 0) {
    return map(getter)
  }
  return map(args[0], getter)
}

export default pluck
