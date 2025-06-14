/**
 * rubico v2.7.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2025 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, thunkify) {
  if (typeof module == 'object') (module.exports = thunkify) // CommonJS
  else if (typeof define == 'function') define(() => thunkify) // AMD
  else (root.thunkify = thunkify) // Browser
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

const funcApply = (func, args) => func(...args)

const thunkify = function (func, ...args) {
  if (areAnyValuesPromises(args)) {
    return promiseAll(args).then(resolvedArgs => function thunk() {
      return func(...resolvedArgs)
    })
  }
  return function thunk() {
    return func(...args)
  }
}

return thunkify
}())))
