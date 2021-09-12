/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, switchCase) {
  if (typeof module == 'object') (module.exports = switchCase) // CommonJS
  else if (typeof define == 'function') define(() => switchCase) // AMD
  else (root.switchCase = switchCase) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const isPromise = value => value != null && typeof value.then == 'function'

const thunkConditional = (
  conditionalExpression, thunkOnTruthy, thunkOnFalsy,
) => conditionalExpression ? thunkOnTruthy() : thunkOnFalsy()

const thunkifyArgs = (func, args) => function thunk() {
  return func(...args)
}

const thunkify3 = (func, arg0, arg1, arg2) => function thunk() {
  return func(arg0, arg1, arg2)
}

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

return switchCase
}())))
