const spread2 = require('./_internal/spread2')
const isPromise = require('./_internal/isPromise')
const promiseAll = require('./_internal/promiseAll')
const strictEqual = require('./_internal/strictEqual')
const curry2 = require('./_internal/curry2')
const always = require('./_internal/always')
const __ = require('./_internal/placeholder')

/**
 * @name eq
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var value any,
 *   leftCompare any,
 *   rightCompare any,
 *   left (value=>Promise|leftCompare)|leftCompare,
 *   right (value=>Promise|rightCompare)|rightCompare
 *
 * eq(left, right)(value) -> Promise|boolean
 * ```
 *
 * @description
 * Test for strict equality (`===`) between the returns of two functions. Either parameter may be an actual value.
 *
 * ```javascript [playground]
 * const personIsGeorge = eq(person => person.name, 'George')
 *
 * console.log(
 *   personIsGeorge({ name: 'George', likes: 'bananas' }),
 * ) // true
 * ```
 *
 * @execution concurrent
 */
const eq = function (left, right) {
  const isLeftResolver = typeof left == 'function',
    isRightResolver = typeof right == 'function'
  if (isLeftResolver && isRightResolver) {
    return function strictEqualBy(value) {
      const leftResolve = left(value),
        rightResolve = right(value)
      const isLeftPromise = isPromise(leftResolve),
        isRightPromise = isPromise(rightResolve)
      if (isLeftPromise && isRightPromise) {
        return promiseAll(
          [leftResolve, rightResolve]).then(spread2(strictEqual))
      } else if (isLeftPromise) {
        return leftResolve.then(curry2(strictEqual, __, rightResolve))
      } else if (isRightPromise) {
        return rightResolve.then(curry2(strictEqual, leftResolve, __))
      }
      return leftResolve === rightResolve
    }
  }

  if (isLeftResolver) {
    return function strictEqualBy(value) {
      const leftResolve = left(value)
      return isPromise(leftResolve)
        ? leftResolve.then(curry2(strictEqual, __, right))
        : leftResolve === right
    }
  }
  if (isRightResolver) {
    return function strictEqualBy(value) {
      const rightResolve = right(value)
      return isPromise(rightResolve)
        ? rightResolve.then(curry2(strictEqual, left, __))
        : left === rightResolve
    }
  }
  return always(left === right)
}

module.exports = eq
