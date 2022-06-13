/**
 * rubico v1.9.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, tryCatch) {
  if (typeof module == 'object') (module.exports = tryCatch) // CommonJS
  else if (typeof define == 'function') define(() => tryCatch) // AMD
  else (root.tryCatch = tryCatch) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

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

const catcherApply = function (catcher, err, args) {
  return catcher(err, ...args)
}

const tryCatch = function (...args) {
  if (args.length > 2) {
    const catcher = args.pop(),
      tryer = args.pop()
    try {
      const result = tryer(...args)
      return isPromise(result)
        ? result.catch(curry3(catcherApply, catcher, __, args))
        : result
    } catch (error) {
      return catcher(error, ...args)
    }
  }

  const tryer = args[0],
    catcher = args[1]
  return function tryCatcher(...args) {
    try {
      const result = tryer(...args)
      return isPromise(result)
        ? result.catch(curry3(catcherApply, catcher, __, args))
        : result
    } catch (error) {
      return catcher(error, ...args)
    }
  }
}

return tryCatch
}())))
