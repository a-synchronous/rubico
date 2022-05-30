/**
 * rubico v1.9.0
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

const thunkConditional = (
  conditionalExpression, thunkOnTruthy, thunkOnFalsy,
) => conditionalExpression ? thunkOnTruthy() : thunkOnFalsy()

const areAllValuesNonfunctions = function (values) {
  const length = values.length
  let index = -1
  while (++index < length) {
    if (typeof values[index] == 'function') {
      return false
    }
  }
  return true
}

const thunkify2 = (func, arg0, arg1) => function thunk() {
  return func(arg0, arg1)
}

const thunkify3 = (func, arg0, arg1, arg2) => function thunk() {
  return func(arg0, arg1, arg2)
}

const always = value => function getter() { return value }

const areAllNonfunctionsTruthy = function (predicates, index) {
  const length = predicates.length
  while (++index < length) {
    let predicate = predicates[index]
    if (isPromise(predicate)) {
      return predicate.then(curry3(
        thunkConditional,
        __,
        thunkify2(areAllNonfunctionsTruthy, predicates, index),
        always(false),
      ))
    }
    if (!predicate) {
      return false
    }
  }
  return true
}

const asyncArePredicatesAllTruthy = async function (predicates, point, index) {
  const length = predicates.length
  while (++index < length) {
    let predicate = predicates[index]
    if (typeof predicate == 'function') {
      predicate = predicate(point)
    }
    if (isPromise(predicate)) {
      predicate = await predicate
    }
    if (!predicate) {
      return false
    }
  }
  return true
}

const and = predicates => {
  if (areAllValuesNonfunctions(predicates)) {
    return areAllNonfunctionsTruthy(predicates, -1)
  }
  return function arePredicatesAllTruthy(point) {
    const length = predicates.length
    let index = -1

    while (++index < length) {
      let predicate = predicates[index]
      if (typeof predicate == 'function') {
        predicate = predicate(point)
      }
      if (isPromise(predicate)) {
        return predicate.then(curry3(
          thunkConditional,
          __,
          thunkify3(asyncArePredicatesAllTruthy, predicates, point, index),
          always(false),
        ))
      }
      if (!predicate) {
        return false
      }
    }
    return true
  }
}

export default and
