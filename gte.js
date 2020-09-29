const spread2 = require('./_internal/spread2')
const isPromise = require('./_internal/isPromise')
const promiseAll = require('./_internal/promiseAll')
const greaterThanOrEqual = require('./_internal/greaterThanOrEqual')
const curry2 = require('./_internal/curry2')
const always = require('./_internal/always')
const __ = require('./_internal/placeholder')

/**
 * @name gte
 *
 * @synopsis
 * ```coffeescript [specscript]
 * gte(
 *   left (any=>Promise|boolean)|any,
 *   right (any=>Promise|boolean)|any,
 * )(value any) -> greaterThanOrEqualBy(value any)=>Promise|boolean
 * ```
 *
 * @description
 * Test for left value greater than or equal to (`>=`) right value. Either parameter may be an asynchronous resolver.
 *
 * ```javascript [playground]
 * const identity = value => value
 *
 * const isAtLeast100 = gte(identity, 100)
 *
 * console.log(isAtLeast100(99)) // false
 * console.log(isAtLeast100(100)) // true
 * console.log(isAtLeast100(101)) // true
 * ```
 */
const gte = function (left, right) {
  const isLeftResolver = typeof left == 'function',
    isRightResolver = typeof right == 'function'
  if (isLeftResolver && isRightResolver) {
    return function greaterThanOrEqualBy(value) {
      const leftResolve = left(value),
        rightResolve = right(value)
      const isLeftPromise = isPromise(leftResolve),
        isRightPromise = isPromise(rightResolve)
      if (isLeftPromise && isRightPromise) {
        return promiseAll(
          [leftResolve, rightResolve]).then(spread2(greaterThanOrEqual))
      } else if (isLeftPromise) {
        return leftResolve.then(curry2(greaterThanOrEqual, __, rightResolve))
      } else if (isRightPromise) {
        return rightResolve.then(curry2(greaterThanOrEqual, leftResolve, __))
      }
      return leftResolve >= rightResolve
    }
  }

  if (isLeftResolver) {
    return function greaterThanOrEqualBy(value) {
      const leftResolve = left(value)
      return isPromise(leftResolve)
        ? leftResolve.then(curry2(greaterThanOrEqual, __, right))
        : leftResolve >= right
    }
  }
  if (isRightResolver) {
    return function strictEqualBy(value) {
      const rightResolve = right(value)
      return isPromise(rightResolve)
        ? rightResolve.then(curry2(greaterThanOrEqual, left, __))
        : left >= rightResolve
    }
  }
  return always(left >= right)
}

module.exports = gte
