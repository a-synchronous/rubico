/**
 * rubico v2.7.9
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2026 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const isPromise = value => value != null && typeof value.then == 'function'

const isArray = Array.isArray

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

const __ = Symbol.for('placeholder')

// argument resolver for curry4
const curry4ResolveArg0 = (
  baseFunc, arg1, arg2, arg3,
) => function arg0Resolver(arg0) {
  return baseFunc(arg0, arg1, arg2, arg3)
}

// argument resolver for curry4
const curry4ResolveArg1 = (
  baseFunc, arg0, arg2, arg3,
) => function arg1Resolver(arg1) {
  return baseFunc(arg0, arg1, arg2, arg3)
}

// argument resolver for curry4
const curry4ResolveArg2 = (
  baseFunc, arg0, arg1, arg3,
) => function arg2Resolver(arg2) {
  return baseFunc(arg0, arg1, arg2, arg3)
}

// argument resolver for curry4
const curry4ResolveArg3 = (
  baseFunc, arg0, arg1, arg2,
) => function arg3Resolver(arg3) {
  return baseFunc(arg0, arg1, arg2, arg3)
}

const curry4 = function (baseFunc, arg0, arg1, arg2, arg3) {
  if (arg0 == __) {
    return curry4ResolveArg0(baseFunc, arg1, arg2, arg3)
  }
  if (arg1 == __) {
    return curry4ResolveArg1(baseFunc, arg0, arg2, arg3)
  }
  if (arg2 == __) {
    return curry4ResolveArg2(baseFunc, arg0, arg1, arg3)
  }
  return curry4ResolveArg3(baseFunc, arg0, arg1, arg2)
}

// argument resolver for curryArgs4
const curryArgs4ResolveArgs0 = (
  baseFunc, arg1, arg2, arg3,
) => function args0Resolver(...args) {
  return baseFunc(args, arg1, arg2, arg3)
}

// argument resolver for curryArgs4
const curryArgs4ResolveArgs1 = (
  baseFunc, arg0, arg2, arg3,
) => function args1Resolver(...args) {
  return baseFunc(arg0, args, arg2, arg3)
}

// argument resolver for curryArgs4
const curryArgs4ResolveArgs2 = (
  baseFunc, arg0, arg1, arg3,
) => function args2Resolver(...args) {
  return baseFunc(arg0, arg1, args, arg3)
}

// argument resolver for curryArgs4
const curryArgs4ResolveArgs3 = (
  baseFunc, arg0, arg1, arg2,
) => function args3Resolver(...args) {
  return baseFunc(arg0, arg1, arg2, args)
}

const curryArgs4 = function (baseFunc, arg0, arg1, arg2, arg3) {
  if (arg0 == __) {
    return curryArgs4ResolveArgs0(baseFunc, arg1, arg2, arg3)
  }
  if (arg1 == __) {
    return curryArgs4ResolveArgs1(baseFunc, arg0, arg2, arg3)
  }
  if (arg2 == __) {
    return curryArgs4ResolveArgs2(baseFunc, arg0, arg1, arg3)
  }
  return curryArgs4ResolveArgs3(baseFunc, arg0, arg1, arg2)
}

const spread2 = func => function spreading2([arg0, arg1]) {
  return func(arg0, arg1)
}

const promiseAll = Promise.all.bind(Promise)

// leftResolverRightResolverCompare(
//   args Array, comparator function, left function, right function,
// ) -> Promise|boolean
const leftResolverRightResolverCompare = function (
  args, comparator, left, right,
) {
  const leftResult = left(...args),
    rightResult = right(...args)
  if (isPromise(leftResult) || isPromise(rightResult)) {
    return promiseAll([leftResult, rightResult]).then(spread2(comparator))
  }
  return comparator(leftResult, rightResult)
}

// leftResolverRightValueCompare(
//   args Array, comparator function, left function, right any
// ) -> Promise|boolean
const leftResolverRightValueCompare = function (args, comparator, left, right) {
  const leftResult = left(...args)
  if (isPromise(leftResult) || isPromise(right)) {
    return promiseAll([leftResult, right]).then(spread2(comparator))
  }
  return comparator(leftResult, right)
}

// leftValueRightResolverCompare(
//   args Array, comparator function, left any, right any,
// ) -> Promise|boolean
const leftValueRightResolverCompare = function (args, comparator, left, right) {
  const rightResult = right(...args)
  if (isPromise(left) || isPromise(rightResult)) {
    return promiseAll([left, rightResult]).then(spread2(comparator))
  }
  return comparator(left, rightResult)
}

// ComparisonOperator(comparator function) -> operator function
const ComparisonOperator = comparator => function operator(...args) {
  const right = args.pop()
  const left = args.pop()
  const isLeftResolver = typeof left == 'function',
    isRightResolver = typeof right == 'function'

  if (isLeftResolver && isRightResolver) {
    if (args.length == 0) {
      return curryArgs4(
        leftResolverRightResolverCompare, __, comparator, left, right,
      )
    }
    if (areAnyValuesPromises(args)) {
      return promiseAll(args).then(curry4(
        leftResolverRightResolverCompare, __, comparator, left, right,
      ))
    }
    return leftResolverRightResolverCompare(args, comparator, left, right)
  }

  if (isLeftResolver) {
    if (args.length == 0) {
      return curryArgs4(
        leftResolverRightValueCompare, __, comparator, left, right,
      )
    }
    if (areAnyValuesPromises(args)) {
      return promiseAll(args).then(curry4(
        leftResolverRightValueCompare, __, comparator, left, right,
      ))
    }
    return leftResolverRightValueCompare(args, comparator, left, right)
  }

  if (isRightResolver) {
    if (args.length == 0) {
      return curryArgs4(
        leftValueRightResolverCompare, __, comparator, left, right,
      )
    }
    if (areAnyValuesPromises(args)) {
      return promiseAll(args).then(curry4(
        leftValueRightResolverCompare, __, comparator, left, right,
      ))
    }
    return leftValueRightResolverCompare(args, comparator, left, right)
  }

  if (isPromise(left) || isPromise(right)) {
    return promiseAll([left, right]).then(spread2(comparator))
  }
  return comparator(left, right)
}

const lessThanOrEqual = (left, right) => left <= right

const lte = ComparisonOperator(lessThanOrEqual)

export default lte
