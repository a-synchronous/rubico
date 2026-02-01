/**
 * rubico v2.7.9
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2026 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, assign) {
  if (typeof module == 'object') (module.exports = assign) // CommonJS
  else if (typeof define == 'function') define(() => assign) // AMD
  else (root.assign = assign) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () { 'use strict'

const isPromise = value => value != null && typeof value.then == 'function'

const objectAssign = Object.assign

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

const always = value => function getter() { return value }

const promiseAll = Promise.all.bind(Promise)

const objectSet = function (object, property, value) {
  object[property] = value
  return object
}

const functionObjectAll = function (funcs, args) {
  const result = {}, promises = []
  for (const key in funcs) {
    const f = funcs[key]
    const resultElement = typeof f == 'function' ? f(...args) : f
    if (isPromise(resultElement)) {
      promises.push(resultElement.then(curry3(objectSet, result, key, __)))
    } else {
      result[key] = resultElement
    }
  }
  return promises.length == 0 ? result : promiseAll(promises).then(always(result))
}

// _assign(object Object, funcs Object<function>) -> Promise|Object
const _assign = function (object, funcs) {
  const result = functionObjectAll(funcs, [object])
  return isPromise(result)
    ? result.then(curry3(objectAssign, {}, object, __))
    : ({ ...object, ...result })
}

const assign = function (arg0, arg1) {
  if (arg1 == null) {
    return curry2(_assign, __, arg0)
  }
  return isPromise(arg0)
    ? arg0.then(curry2(_assign, __, arg1))
    : _assign(arg0, arg1)
}

return assign
}())))
