/**
 * rubico v1.9.7
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2023 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

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

const promiseAll = Promise.all.bind(Promise)

const funcConcat = (
  funcA, funcB,
) => function pipedFunction(...args) {
  const intermediate = funcA(...args)
  return isPromise(intermediate)
    ? intermediate.then(funcB)
    : funcB(intermediate)
}

const funcApply = (func, args) => func(...args)

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

const pipe = function (...args) {
  const funcs = args.pop()
  const pipeline = funcs.reduce(funcConcat)

  if (args.length == 0) {
    return pipeline
  }

  if (areAnyValuesPromises(args)) {
    return promiseAll(args).then(curry2(funcApply, pipeline, __))
  }

  return pipeline(...args)
}

export default pipe
