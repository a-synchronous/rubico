/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, when) {
  if (typeof module == 'object') (module.exports = when) // CommonJS
  else if (typeof define == 'function') define(() => when) // AMD
  else (root.when = when) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const isPromise = value => value != null && typeof value.then == 'function'

const always = value => function getter() { return value }

const __ = Symbol.for('placeholder')

const thunkify1 = (func, arg0) => function thunk() {
  return func(arg0)
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

const thunkConditional = (
  conditionalExpression, thunkOnTruthy, thunkOnFalsy,
) => conditionalExpression ? thunkOnTruthy() : thunkOnFalsy()

const when = (predicate, func) => function whenFunc(value) {
  const predication = predicate(value)
  if (isPromise(predication)) {
    return predication.then(curry3(
      thunkConditional,
      __,
      thunkify1(func, value),
      always(value),
    ))
  }
  if (predication) {
    return func(value)
  }
  return value
}

return when
}())))
