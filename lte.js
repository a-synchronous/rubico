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
 * lte(leftValue any, rightValue any) -> boolean
 * lte(leftValue any, right function)(value any) -> Promise|boolean
 * lte(left function, rightValue any)(value any) -> Promise|boolean
 * lte(left function, right function)(value any) -> Promise|boolean
 * ```
 *
 * @description
 * Test if a left value is less than or equal (`<=`) to a right value. Either parameter may be an actual value.
 *
 * If both arguments are values, `lte` eagerly computes and returns a boolean value.
 *
 * ```javascript [playground]
 * console.log(lte(1, 3)) // true
 * console.log(lte(3, 3)) // true
 * console.log(lte(4, 3)) // false
 * ```
 *
 * If both arguments are functions, `lte` treats those functions as argument resolvers and returns a function that first resolves its arguments by the argument resolvers before making the comparison.
 *
 * If only one argument is a function, `lte` still returns a function that resolves its arguments by the argument resolver, treating the value (non function) argument as an already resolved value for comparison.
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
    return function lessThanOrEqualBy(value) {
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
    return function lessThanOrEqualBy(value) {
      const leftResolve = left(value)
      return isPromise(leftResolve)
        ? leftResolve.then(curry2(lessThanOrEqual, __, right))
        : leftResolve <= right
    }
  }
  if (isRightResolver) {
    return function lessThanOrEqualBy(value) {
      const rightResolve = right(value)
      return isPromise(rightResolve)
        ? rightResolve.then(curry2(lessThanOrEqual, left, __))
        : left <= rightResolve
    }
  }

  return left <= right
}

module.exports = lte
