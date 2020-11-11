const spread2 = require('./_internal/spread2')
const isPromise = require('./_internal/isPromise')
const promiseAll = require('./_internal/promiseAll')
const lessThan = require('./_internal/lessThan')
const curry2 = require('./_internal/curry2')
const always = require('./_internal/always')
const __ = require('./_internal/placeholder')

/**
 * @name lt
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var value any,
 *   leftCompare any,
 *   rightCompare any,
 *   left (value=>Promise|leftCompare)|leftCompare,
 *   right (value=>Promise|rightCompare)|rightCompare
 *
 * lt(left, right)(value) -> Promise|boolean
 * ```
 *
 * @description
 * Test if a left value is less than (`<`) a right value. Either parameter may be an actual value.
 *
 * ```javascript [playground]
 * const identity = value => value
 *
 * const isLessThan3 = lt(identity, 3)
 *
 * console.log(isLessThan3(1), true)
 * console.log(isLessThan3(3), false)
 * console.log(isLessThan3(5), false)
 * ```
 */
const lt = function (left, right) {
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
          [leftResolve, rightResolve]).then(spread2(lessThan))
      } else if (isLeftPromise) {
        return leftResolve.then(curry2(lessThan, __, rightResolve))
      } else if (isRightPromise) {
        return rightResolve.then(curry2(lessThan, leftResolve, __))
      }
      return leftResolve < rightResolve
    }
  }

  if (isLeftResolver) {
    return function lessThanBy(value) {
      const leftResolve = left(value)
      return isPromise(leftResolve)
        ? leftResolve.then(curry2(lessThan, __, right))
        : leftResolve < right
    }
  }
  if (isRightResolver) {
    return function lessThanBy(value) {
      const rightResolve = right(value)
      return isPromise(rightResolve)
        ? rightResolve.then(curry2(lessThan, left, __))
        : left < rightResolve
    }
  }
  return function lessThanBy(value) {
    return value != null && typeof value.eq == 'function'
      ? value.lt(left, right)
      : left < right
  }
}

module.exports = lt
