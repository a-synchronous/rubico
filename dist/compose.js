/**
 * rubico v2.3.2
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2024 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, compose) {
  if (typeof module == 'object') (module.exports = compose) // CommonJS
  else if (typeof define == 'function') define(() => compose) // AMD
  else (root.compose = compose) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'
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

const promiseAll = Promise.all.bind(Promise)

const funcApply = (func, args) => func(...args)

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

const funcConcat = (
  funcA, funcB,
) => function pipedFunction(...args) {
  const intermediate = funcA(...args)
  return isPromise(intermediate)
    ? intermediate.then(funcB)
    : funcB(intermediate)
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

return compose
}())))
