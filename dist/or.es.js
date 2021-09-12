/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

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

const asyncOr = async function (predicates, value) {
  const length = predicates.length
  let index = -1
  while (++index < length) {
    let predication = predicates[index](value)
    if (isPromise(predication)) {
      predication = await predication
    }
    if (predication) {
      return true
    }
  }
  return false
}

// handles the first predication before asyncOr
const _asyncOrInterlude = (
  predicates, value, firstPredication,
) => firstPredication ? true : asyncOr(predicates, value)

const or = predicates => function anyPredicates(value) {
  if (value != null && typeof value.or == 'function') {
    return value.or(predicates)
  }
  const length = predicates.length
  let index = -1

  while (++index < length) {
    const predication = predicates[index](value)
    if (isPromise(predication)) {
      return predication.then(curry3(_asyncOrInterlude, predicates, value, __))
    }
    if (predication) {
      return true
    }
  }
  return false
}

export default or
