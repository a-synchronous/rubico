/**
 * Rubico v2.8.2
 * https://rubico.land/
 *
 * © Richard Yufei Tong, King of Software
 * Rubico may be freely distributed under the CFOSS license.
 */

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

function _thunkifyArgs(func, context, args) {
  return function thunk() {
    return func.apply(context, args)
  }
}

const thunkify = function thunkify(func, ...args) {
  if (areAnyValuesPromises(args)) {
    return promiseAll(args).then(curry3(_thunkifyArgs, func, this, __))
  }
  return _thunkifyArgs(func, this, args)
}

thunkify.call = function thunkifyCall(func, context, ...args) {
  if (areAnyValuesPromises(args)) {
    return promiseAll(args).then(curry3(_thunkifyArgs, func, context, __))
  }
  return _thunkifyArgs(func, context, args)
}

export default thunkify
