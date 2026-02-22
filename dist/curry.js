/**
 * Rubico v2.8.2
 * https://rubico.land/
 *
 * © Richard Yufei Tong, King of Software
 * Rubico may be freely distributed under the CFOSS license.
 */

(function (root, curry) {
  if (typeof module == 'object') (module.exports = curry) // CommonJS
  else if (typeof define == 'function') define(() => curry) // AMD
  else (root.curry = curry) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const isArray = Array.isArray

const isPromise = value => value != null && typeof value.then == 'function'

const areAnyValuesPromises = function (values) {
  if (isArray(values)) {
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

  for (const key in values) {
    const value = values[key]
    if (isPromise(value)) {
      return true
    }
  }
  return false
}

const promiseAll = Promise.all.bind(Promise)

const __ = Symbol.for('placeholder')

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

const funcApply2 = (func, context, args) => func.apply(context, args)

const _curryArity = (arity, func, context, args) => function curried(...curriedArgs) {
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
      if (areAnyValuesPromises(nextArgs)) {
        return numCurriedPlaceholders == 0
          ? promiseAll(nextArgs).then(curry3(funcApply2, func, context, __))
          : promiseAll(nextArgs).then(curry4(curryArity, arity, func, context, __))
      }
      return numCurriedPlaceholders == 0
        ? func.apply(context, nextArgs)
        : curryArity(arity, func, context, nextArgs)
    }
  }

  while (++curriedArgsIndex < curriedArgsLength) {
    const curriedArg = curriedArgs[curriedArgsIndex]
    if (curriedArg == __) {
      numCurriedPlaceholders += 1
    }
    nextArgs.push(curriedArg)

    if (nextArgs.length == arity) {
      if (areAnyValuesPromises(nextArgs)) {
        return numCurriedPlaceholders == 0
          ? promiseAll(nextArgs).then(curry3(funcApply2, func, context, __))
          : promiseAll(nextArgs).then(curry4(curryArity, arity, func, context, __))
      }
      return numCurriedPlaceholders == 0
        ? func.apply(context, nextArgs)
        : curryArity(arity, func, context, nextArgs)
    }
  }

  return areAnyValuesPromises(nextArgs)
    ? promiseAll(nextArgs).then(curry4(curryArity, arity, func, context, __))
    : curryArity(arity, func, context, nextArgs)
}

const curryArity = function (arity, func, context, args) {
  const argsLength = args.length
  if (argsLength < arity) {
    return _curryArity(arity, func, context, args)
  }
  let argsIndex = -1
  while (++argsIndex < argsLength) {
    const arg = args[argsIndex]
    if (arg == __) {
      return _curryArity(arity, func, context, args)
    }
  }
  return func.apply(context, args)
}

const curry = (func, ...args) => {
  if (areAnyValuesPromises(args)) {
    return promiseAll(args).then(curry4(curryArity, func.length, func, this, __))
  }
  return curryArity(func.length, func, this, args)
}

curry.arity = function curryArity_(arity, func, ...args) {
  if (areAnyValuesPromises(args)) {
    return promiseAll(args).then(curry4(curryArity, arity, func, this, __))
  }
  return curryArity(arity, func, this, args)
}

curry.call = function call(func, context, ...args) {
  if (areAnyValuesPromises(args)) {
    return promiseAll(args).then(curry4(curryArity, func.length, func, context, __))
  }
  return curryArity(func.length, func, context, args)
}

return curry
}())))
