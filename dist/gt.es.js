/**
 * rubico v1.8.1
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2021 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const spread2 = func => function spreading2([arg0, arg1]) {
  return func(arg0, arg1)
}

const isPromise = value => value != null && typeof value.then == 'function'

const promiseAll = Promise.all.bind(Promise)

const greaterThan = (left, right) => left > right

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

const always = value => function getter() { return value }

const gt = function (left, right) {
  const isLeftResolver = typeof left == 'function',
    isRightResolver = typeof right == 'function'
  if (isLeftResolver && isRightResolver) {
    return function greaterThanBy(value) {
      const leftResolve = left(value),
        rightResolve = right(value)
      const isLeftPromise = isPromise(leftResolve),
        isRightPromise = isPromise(rightResolve)
      if (isLeftPromise && isRightPromise) {
        return promiseAll(
          [leftResolve, rightResolve]).then(spread2(greaterThan))
      } else if (isLeftPromise) {
        return leftResolve.then(curry2(greaterThan, __, rightResolve))
      } else if (isRightPromise) {
        return rightResolve.then(curry2(greaterThan, leftResolve, __))
      }
      return leftResolve > rightResolve
    }
  }

  if (isLeftResolver) {
    return function greaterThanBy(value) {
      const leftResolve = left(value)
      return isPromise(leftResolve)
        ? leftResolve.then(curry2(greaterThan, __, right))
        : leftResolve > right
    }
  }
  if (isRightResolver) {
    return function strictEqualBy(value) {
      const rightResolve = right(value)
      return isPromise(rightResolve)
        ? rightResolve.then(curry2(greaterThan, left, __))
        : left > rightResolve
    }
  }
  return function greaterThanBy(value) {
    return value != null && typeof value.eq == 'function'
      ? value.gt(left, right)
      : left > right
  }
}

export default gt
