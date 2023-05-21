const areAnyValuesPromises = require('./_internal/areAnyValuesPromises')
const curryArgs3 = require('./_internal/curryArgs3')
const spread2 = require('./_internal/spread2')
const isPromise = require('./_internal/isPromise')
const promiseAll = require('./_internal/promiseAll')
const greaterThan = require('./_internal/greaterThan')
const curry2 = require('./_internal/curry2')
const always = require('./_internal/always')
const __ = require('./_internal/placeholder')

// leftResolverRightResolverGt(args Array, left function, right function) -> Promise|boolean
const leftResolverRightResolverGt = function (args, left, right) {
  const leftResult = left(...args),
    rightResult = right(...args)
  if (isPromise(leftResult) || isPromise(rightResult)) {
    return promiseAll([leftResult, rightResult]).then(spread2(greaterThan))
  }
  return greaterThan(leftResult, rightResult)
}

// leftResolverRightValueGt(args Array, left function, right any) -> Promise|boolean
const leftResolverRightValueGt = function (args, left, right) {
  const leftResult = left(...args)
  if (isPromise(leftResult) || isPromise(right)) {
    return promiseAll([leftResult, right]).then(spread2(greaterThan))
  }
  return greaterThan(leftResult, right)
}

// leftValueRightResolverGt(args Array, left any, right any) -> Promise|boolean
const leftValueRightResolverGt = function (args, left, right) {
  const rightResult = right(...args)
  if (isPromise(left) || isPromise(rightResult)) {
    return promiseAll([left, rightResult]).then(spread2(greaterThan))
  }
  return greaterThan(left, rightResult)
}

/**
 * @name gt
 *
 * @synopsis
 * ```coffeescript [specscript]
 * gt(leftValue any, rightValue any) -> boolean
 *
 * gt(leftValue any, right function)(...args) -> Promise|boolean
 *
 * gt(left function, rightValue any)(...args) -> Promise|boolean
 *
 * gt(left function, right function)(...args) -> Promise|boolean
 *
 * gt(...args, left function, right function) -> Promise|boolean
 * ```
 *
 * @description
 * Test if a value is greater than (`>`) another value.
 *
 * ```javascript [playground]
 * const age = 40
 *
 * const isAgeGreaterThan21 = gt(age, 21)
 *
 * console.log(isAgeGreaterThan21) // true
 * ```
 *
 * If either of the two values are resolver functions, `gt` returns a function that resolves the values to compare from its arguments.
 *
 * ```javascript [playground]
 * const isOfLegalAge = gt(21, get('age'))
 *
 * const juvenile = { age: 16 }
 *
 * console.log(isOfLegalAge(juvenile)) // false
 * ```
 */
const gt = function (...args) {
  const right = args.pop()
  const left = args.pop()
  const isLeftResolver = typeof left == 'function',
    isRightResolver = typeof right == 'function'

  if (isLeftResolver && isRightResolver) {
    if (args.length == 0) {
      return curryArgs3(leftResolverRightResolverGt, __, left, right)
    }
    if (areAnyValuesPromises(args)) {
      return promiseAll(args)
        .then(curryArgs3(leftResolverRightResolverGt, __, left, right))
    }
    return leftResolverRightResolverGt(args, left, right)
  }

  if (isLeftResolver) {
    return curryArgs3(leftResolverRightValueGt, __, left, right)
  }

  if (isRightResolver) {
    return curryArgs3(leftValueRightResolverGt, __, left, right)
  }

  return greaterThan(left, right)
}

module.exports = gt
