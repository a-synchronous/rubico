/**
 * rubico v1.8.15
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

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

const always = value => function getter() { return value }

const funcsOrValuesConditional = function (funcsOrValues, args, funcsIndex) {
  const lastIndex = funcsOrValues.length - 1

  while ((funcsIndex += 2) < lastIndex) {
    const predicate = funcsOrValues[funcsIndex],
      resolverOrValue = funcsOrValues[funcsIndex + 1]

    const predication = typeof predicate == 'function'
      ? predicate(...args)
      : predicate

    if (isPromise(predication)) {
      return predication.then(curry3(
        thunkConditional,
        __,
        typeof resolverOrValue == 'function'
          ? thunkifyArgs(resolverOrValue, args)
          : always(resolverOrValue),
        thunkify3(funcsOrValuesConditional, funcsOrValues, args, funcsIndex),
      ))
    }

    if (predication) {
      return typeof resolverOrValue == 'function'
        ? resolverOrValue(...args)
        : resolverOrValue
    }
  }

  // even number of funcsOrValues
  if (funcsIndex == funcsOrValues.length) {
    return undefined
  }

  const defaultResolverOrValue = funcsOrValues[lastIndex]
  return typeof defaultResolverOrValue == 'function'
    ? defaultResolverOrValue(...args)
    : defaultResolverOrValue
}

const areFuncsOrValuesAllValues = function (funcsOrValues) {
  const length = funcsOrValues.length
  let index = -1
  while (++index < length) {
    if (typeof funcsOrValues[index] == 'function') {
      return false
    }
  }
  return true
}

const thunkify2 = (func, arg0, arg1) => function thunk() {
  return func(arg0, arg1)
}

const arrayConditional = function (array, index) {
  const length = array.length,
    lastIndex = length - 1
  while ((index += 2) < lastIndex) {
    const predication = array[index],
      value = array[index + 1]
    if (isPromise(predication)) {
      return predication.then(curry3(
        thunkConditional,
        __,
        always(value),
        thunkify2(arrayConditional, array, index),
      ))
    }
    if (predication) {
      return value
    }
  }
  // even number of array values
  if (index == length) {
    return undefined
  }
  return array[index]
}

const switchCase = funcsOrValues => {
  if (areFuncsOrValuesAllValues(funcsOrValues)) {
    return arrayConditional(funcsOrValues, -2)
  }
  return function switchingCases(...args) {
    return funcsOrValuesConditional(funcsOrValues, args, -2)
  }
}

export default switchCase
