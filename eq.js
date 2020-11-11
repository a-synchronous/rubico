const spread2 = require('./_internal/spread2')
const isPromise = require('./_internal/isPromise')
const promiseAll = require('./_internal/promiseAll')
const equal = require('./_internal/equal')
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
 * Test for equality (`==`) between the returns of two functions. Either parameter may be an actual value.
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
    return function equalBy(value) {
      const leftResolve = left(value),
        rightResolve = right(value)
      const isLeftPromise = isPromise(leftResolve),
        isRightPromise = isPromise(rightResolve)
      if (isLeftPromise && isRightPromise) {
        return promiseAll(
          [leftResolve, rightResolve]).then(spread2(equal))
      } else if (isLeftPromise) {
        return leftResolve.then(curry2(equal, __, rightResolve))
      } else if (isRightPromise) {
        return rightResolve.then(curry2(equal, leftResolve, __))
      }
      return leftResolve == rightResolve
    }
  }

  if (isLeftResolver) {
    return function equalBy(value) {
      const leftResolve = left(value)
      return isPromise(leftResolve)
        ? leftResolve.then(curry2(equal, __, right))
        : leftResolve == right
    }
  }
  if (isRightResolver) {
    return function equalBy(value) {
      const rightResolve = right(value)
      return isPromise(rightResolve)
        ? rightResolve.then(curry2(equal, left, __))
        : left == rightResolve
    }
  }
  return function equalBy(value) {
    return value != null && typeof value.eq == 'function'
      ? value.eq(left, right)
      : left == right
  }
}

module.exports = eq
