const areAnyValuesPromises = require('./_internal/areAnyValuesPromises')
const curryArgs3 = require('./_internal/curryArgs3')
const spread2 = require('./_internal/spread2')
const isPromise = require('./_internal/isPromise')
const promiseAll = require('./_internal/promiseAll')
const lessThan = require('./_internal/lessThan')
const curry2 = require('./_internal/curry2')
const always = require('./_internal/always')
const __ = require('./_internal/placeholder')

// leftResolverRightResolverLt(args Array, left function, right function) -> Promise|boolean
const leftResolverRightResolverLt = function (args, left, right) {
  const leftResult = left(...args),
    rightResult = right(...args)
  if (isPromise(leftResult) || isPromise(rightResult)) {
    return promiseAll([leftResult, rightResult]).then(spread2(lessThan))
  }
  return lessThan(leftResult, rightResult)
}

// leftResolverRightValueLt(args Array, left function, right any) -> Promise|boolean
const leftResolverRightValueLt = function (args, left, right) {
  const leftResult = left(...args)
  if (isPromise(leftResult) || isPromise(right)) {
    return promiseAll([leftResult, right]).then(spread2(lessThan))
  }
  return lessThan(leftResult, right)
}

// leftValueRightResolverLt(args Array, left any, right any) -> Promise|boolean
const leftValueRightResolverLt = function (args, left, right) {
  const rightResult = right(...args)
  if (isPromise(left) || isPromise(rightResult)) {
    return promiseAll([left, rightResult]).then(spread2(lessThan))
  }
  return lessThan(left, rightResult)
}

/**
 * @name lt
 *
 * @synopsis
 * ```coffeescript [specscript]
 * lt(leftValue any, rightValue any) -> boolean
 *
 * lt(leftValue any, right function)(...args) -> Promise|boolean
 *
 * lt(left function, rightValue any)(...args) -> Promise|boolean
 *
 * lt(left function, right function)(...args) -> Promise|boolean
 *
 * lt(...args, left function, right function) -> Promise|boolean
 * ```
 *
 * @description
 * Test if a value is less than (`<`) another value.
 *
 * ```javascript [playground]
 * console.log(lt(1, 3)) // true
 * console.log(lt(3, 3)) // false
 * console.log(lt(4, 3)) // false
 * ```
 *
 * If either of the two values are resolver functions, `lt` returns a function that resolves the values to compare from its arguments.
 *
 * ```javascript [playground]
 * const identity = value => value
 *
 * const isLessThan3 = lt(identity, 3)
 *
 * console.log(isLessThan3(1)) // true
 * console.log(isLessThan3(3)) // false
 * console.log(isLessThan3(5)) // false
 * ```
 */
const lt = function (...args) {
  const right = args.pop()
  const left = args.pop()
  const isLeftResolver = typeof left == 'function',
    isRightResolver = typeof right == 'function'

  if (isLeftResolver && isRightResolver) {
    if (args.length == 0) {
      return curryArgs3(leftResolverRightResolverLt, __, left, right)
    }
    if (areAnyValuesPromises(args)) {
      return promiseAll(args)
        .then(curryArgs3(leftResolverRightResolverLt, __, left, right))
    }
    return leftResolverRightResolverLt(args, left, right)
  }

  if (isLeftResolver) {
    return curryArgs3(leftResolverRightValueLt, __, left, right)
  }

  if (isRightResolver) {
    return curryArgs3(leftValueRightResolverLt, __, left, right)
  }

  return lessThan(left, right)
}

module.exports = lt
