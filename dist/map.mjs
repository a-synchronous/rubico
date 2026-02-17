/**
 * rubico v2.7.9
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2026 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const isPromise = value => value != null && typeof value.then == 'function'

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
    const resultElement = mapper(array[index], index, array)
    if (isPromise(resultElement)) {
      isAsync = true
    }
    result[index] = resultElement
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
  for (const element of set) {
    const resultElement = mapper(element, element, set)
    if (isPromise(resultElement)) {
      promises.push(resultElement.then(curry3(callPropUnary, result, 'add', __)))
    } else {
      result.add(resultElement)
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
  for (const [key, element] of value) {
    const resultElement = mapper(element, key, value)
    if (isPromise(resultElement)) {
      promises.push(resultElement.then(
        curry4(callPropBinary, result, 'set', key, __)))
    } else {
      result.set(key, resultElement)
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
    const resultElement = mapper(object[key], key, object)
    if (isPromise(resultElement)) {
      isAsync = true
    }
    result[key] = resultElement
  }
  return isAsync ? promiseObjectAll(result) : result
}

const funcConcat = (
  funcA, funcB,
) => function pipedFunction(...args) {
  const intermediate = funcA(...args)
  return isPromise(intermediate)
    ? intermediate.then(funcB)
    : funcB(intermediate)
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
    const resultElement = mapper(array[index], index)
    result[index] = isPromise(resultElement) ? await resultElement : resultElement
  }
  return result
}

const arrayMapSeries = function (array, mapper) {
  const arrayLength = array.length,
    result = Array(arrayLength)
  let index = -1

  while (++index < arrayLength) {
    const resultElement = mapper(array[index], index)
    if (isPromise(resultElement)) {
      return resultElement.then(funcConcat(
        curry3(objectSet, result, index, __),
        curry4(arrayMapSeriesAsync, array, mapper, __, index)))
    }
    result[index] = resultElement
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
    let resultElement = f(object[key])
    if (isPromise(resultElement)) {
      resultElement = await resultElement
    }
    result[key] = resultElement
  }
  return result
}

const objectMapSeries = function (object, f) {
  const result = {}
  const doneKeys = {}
  for (const key in object) {
    doneKeys[key] = true
    const resultElement = f(object[key], key, object)
    if (isPromise(resultElement)) {
      return resultElement.then(funcConcat(
        curry3(objectSet, result, key, __),
        thunkify4(_objectMapSeriesAsync, object, f, result, doneKeys),
      ))
    }
    result[key] = resultElement
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
    let resultElement = f(iteration.value)
    if (isPromise(resultElement)) {
      resultElement = await resultElement
    }
    result.add(resultElement)
    iteration = iterator.next()
  }
  return result
}

const setMapSeries = function (set, f) {
  const result = new Set()
  const iterator = set[symbolIterator]()
  let iteration = iterator.next()
  while (!iteration.done) {
    const resultElement = f(iteration.value)
    if (isPromise(resultElement)) {
      return resultElement.then(funcConcat(
        curry2(setAdd, result, __),
        thunkify3(_setMapSeriesAsync, iterator, f, result),
      ))
    }
    result.add(resultElement)
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
    let resultElement = f(iteration.value[1])
    if (isPromise(resultElement)) {
      resultElement = await resultElement
    }
    result.set(iteration.value[0], resultElement)
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
    const resultElement = f(iteration.value[1])
    if (isPromise(resultElement)) {
      return resultElement.then(funcConcat(
        curry3(mapSet, result, key, __),
        thunkify3(_mapMapSeriesAsync, iterator, f, result),
      ))
    }
    result.set(key, resultElement)
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
    const resultElement = f(array[index])
    if (isPromise(resultElement)) {
      const selfDeletingPromise = resultElement.then(
        tapSync(() => promises.delete(selfDeletingPromise)))
      promises.add(selfDeletingPromise)
      result[index] = selfDeletingPromise
    } else {
      result[index] = resultElement
    }
  }
  return promiseAll(result)
}

const arrayMapPool = function (array, concurrency, f) {
  const arrayLength = array.length,
    result = Array(arrayLength)
  let index = -1
  while (++index < arrayLength) {
    const resultElement = f(array[index])
    if (isPromise(resultElement)) {
      const promises = new Set(),
        selfDeletingPromise = resultElement.then(
          tapSync(() => promises.delete(selfDeletingPromise)))
      promises.add(selfDeletingPromise)
      result[index] = selfDeletingPromise
      return arrayMapPoolAsync(
        array, f, concurrency, result, index, promises)
    }
    result[index] = resultElement
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
    const resultElement = f(iteration.value, iteration.value, s)
    if (isPromise(resultElement)) {
      const selfDeletingPromise = resultElement.then(resolvedValue => {
        promises.delete(selfDeletingPromise)
        result.add(resolvedValue)
      })
      promises.add(selfDeletingPromise)
    } else {
      result.add(resultElement)
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
    const resultElement = f(iteration.value, iteration.value, s)
    if (isPromise(resultElement)) {
      const promises = new Set()
      const selfDeletingPromise = resultElement.then(resolvedValue => {
        promises.delete(selfDeletingPromise)
        result.add(resolvedValue)
      })
      promises.add(selfDeletingPromise)
      return _setMapPoolAsync(s, iterator, concurrency, f, result, promises)
    }
    result.add(resultElement)
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
    const resultElement = f(iteration.value[1], key, m)
    if (isPromise(resultElement)) {
      result.set(key, resultElement)
      const selfDeletingPromise = resultElement.then(resolvedValue => {
        promises.delete(selfDeletingPromise)
        result.set(key, resolvedValue)
      })
      promises.add(selfDeletingPromise)
    } else {
      result.set(key, resultElement)
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
    const resultElement = f(iteration.value[1], key, m)
    if (isPromise(resultElement)) {
      const promises = new Set()
      result.set(key, resultElement)
      const selfDeletingPromise = resultElement.then(resolvedValue => {
        promises.delete(selfDeletingPromise)
        result.set(key, resolvedValue)
      })
      promises.add(selfDeletingPromise)
      return _mapMapPoolAsync(m, iterator, concurrency, f, result, promises)
    }
    result.set(key, resultElement)
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
    const resultElement = f(o[key], key, o)
    if (isPromise(resultElement)) {
      result[key] = resultElement
      const selfDeletingPromise = resultElement.then(resolvedValue => {
        promises.delete(selfDeletingPromise)
        result[key] = resolvedValue
      })
      promises.add(selfDeletingPromise)
    } else {
      result[key] = resultElement
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
    const resultElement = f(o[key], key, o)
    if (isPromise(resultElement)) {
      const promises = new Set()
      result[key] = resultElement
      const selfDeletingPromise = resultElement.then(resolvedValue => {
        promises.delete(selfDeletingPromise)
        result[key] = resolvedValue
      })
      promises.add(selfDeletingPromise)
      return _objectMapPoolAsync(o, concurrency, f, result, doneKeys, promises)
    }
    result[key] = resultElement
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

const _map = function (value, f) {
  if (isArray(value)) {
    return arrayMap(value, f)
  }
  if (value == null) {
    return value
  }

  if (typeof value.then == 'function') {
    return value.then(f)
  }
  if (typeof value.map == 'function') {
    return value.map(f)
  }
  if (typeof value == 'string' || value.constructor == String) {
    return stringMap(value, f)
  }
  if (value.constructor == Set) {
    return setMap(value, f)
  }
  if (value.constructor == Map) {
    return mapMap(value, f)
  }
  if (typeof value[symbolIterator] == 'function') {
    return MappingIterator(value[symbolIterator](), f)
  }
  if (typeof value[symbolAsyncIterator] == 'function') {
    return MappingAsyncIterator(value[symbolAsyncIterator](), f)
  }
  if (value.constructor == Object) {
    return objectMap(value, f)
  }
  return f(value)
}

const map = function (arg0, arg1) {
  if (arg1 == null) {
    return curry2(_map, __, arg0)
  }
  return isPromise(arg0)
    ? arg0.then(curry2(_map, __, arg1))
    : _map(arg0, arg1)
}

// _mapEntries(value Object|Map, f function) -> Object|Map
const _mapEntries = (value, f) => {
  if (value == null) {
    throw new TypeError('value is not an Object or Map')
  }
  if (value.constructor == Object) {
    return objectMapEntries(value, f)
  }
  if (value.constructor == Map) {
    return mapMapEntries(value, f)
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

const _mapPool = function (f, concurrency, mapper) {
  if (isArray(f)) {
    return arrayMapPool(f, concurrency, mapper)
  }
  if (f == null) {
    throw new TypeError(`invalid functor ${f}`)
  }
  if (typeof f == 'string' || f.constructor == String) {
    return stringMapPool(f, concurrency, mapper)
  }
  if (f.constructor == Set) {
    return setMapPool(f, concurrency, mapper)
  }
  if (f.constructor == Map) {
    return mapMapPool(f, concurrency, mapper)
  }
  if (f.constructor == Object) {
    return objectMapPool(f, concurrency, mapper)
  }
  throw new TypeError(`invalid functor ${f}`)
}

map.pool = function mapPool(arg0, arg1, arg2) {
  if (arg2 == null) {
    return curry3(_mapPool, __, arg0, arg1)
  }
  return isPromise(arg0)
    ? arg0.then(curry3(_mapPool, __, arg1, arg2))
    : _mapPool(arg0, arg1, arg2)
}

export default map
