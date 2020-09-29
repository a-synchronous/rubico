const spread2 = require('./_internal/spread2')
const isPromise = require('./_internal/isPromise')
const promiseAll = require('./_internal/promiseAll')
const lessThanOrEqual = require('./_internal/lessThanOrEqual')
const curry2 = require('./_internal/curry2')
const always = require('./_internal/always')
const __ = require('./_internal/placeholder')

/**
 * @name lte
 *
 * @synopsis
 * ```coffeescript [specscript]
 * lte(
 *   left (any=>Promise|boolean)|any,
 *   right (any=>Promise|boolean)|any,
 * )(value any) -> lessThanBy(value any)=>Promise|boolean
 * ```
 *
 * @description
 * Test for left value less than or equal to (`<=`) right value. Either parameter may be an asynchronous resolver.
 *
 * ```javascript [playground]
 * const identity = value => value
 *
 * const isLessThanOrEqualTo3 = lte(identity, 3)
 *
 * console.log(isLessThanOrEqualTo3(1), true)
 * console.log(isLessThanOrEqualTo3(3), true)
 * console.log(isLessThanOrEqualTo3(5), false)
 * ```
 */
const lte = function (left, right) {
  const isLeftResolver = typeof left == 'function',
    isRightResolver = typeof right == 'function'
  if (isLeftResolver && isRightResolver) {
    return function lessThanBy(value) {
      const leftResolve = left(value),
        rightResolve = right(value)
      const isLeftPromise = isPromise(leftResolve),
        isRightPromise = isPromise(rightResolve)
      if (isLeftPromise && isRightPromise) {
        return promiseAll(
          [leftResolve, rightResolve]).then(spread2(lessThanOrEqual))
      } else if (isLeftPromise) {
        return leftResolve.then(curry2(lessThanOrEqual, __, rightResolve))
      } else if (isRightPromise) {
        return rightResolve.then(curry2(lessThanOrEqual, leftResolve, __))
      }
      return leftResolve <= rightResolve
    }
  }

  if (isLeftResolver) {
    return function lessThanBy(value) {
      const leftResolve = left(value)
      return isPromise(leftResolve)
        ? leftResolve.then(curry2(lessThanOrEqual, __, right))
        : leftResolve <= right
    }
  }
  if (isRightResolver) {
    return function strictEqualBy(value) {
      const rightResolve = right(value)
      return isPromise(rightResolve)
        ? rightResolve.then(curry2(lessThanOrEqual, left, __))
        : left <= rightResolve
    }
  }
  return always(left <= right)
}

module.exports = lte
