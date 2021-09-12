/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const isArray = Array.isArray

const isPromise = value => value != null && typeof value.then == 'function'

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

const funcConcat = (
  funcA, funcB,
) => function pipedFunction(...args) {
  const intermediate = funcA(...args)
  return isPromise(intermediate)
    ? intermediate.then(funcB)
    : funcB(intermediate)
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

export default fork
