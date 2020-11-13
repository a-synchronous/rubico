const spread2 = require('./_internal/spread2')
const isPromise = require('./_internal/isPromise')
const promiseAll = require('./_internal/promiseAll')
const sameValueZero = require('./_internal/sameValueZero')
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
 * Test for [SameValueZero](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero) between the returns of two functions. Either parameter may be an actual value for comparison.
 *
 * ```javascript [playground]
 * const personIsGeorge = eq(person => person.name, 'George')
 *
 * console.log(
 *   personIsGeorge({ name: 'George', likes: 'bananas' }),
 * ) // true
 * ```
 *
 * More on SameValueZero: [Equality comparisons and sameness](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)
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
          [leftResolve, rightResolve]).then(spread2(sameValueZero))
      } else if (isLeftPromise) {
        return leftResolve.then(curry2(sameValueZero, __, rightResolve))
      } else if (isRightPromise) {
        return rightResolve.then(curry2(sameValueZero, leftResolve, __))
      }
      return sameValueZero(leftResolve, rightResolve)
    }
  }

  if (isLeftResolver) {
    return function equalBy(value) {
      const leftResolve = left(value)
      return isPromise(leftResolve)
        ? leftResolve.then(curry2(sameValueZero, __, right))
        : sameValueZero(leftResolve, right)
    }
  }
  if (isRightResolver) {
    return function equalBy(value) {
      const rightResolve = right(value)
      return isPromise(rightResolve)
        ? rightResolve.then(curry2(sameValueZero, left, __))
        : sameValueZero(left, rightResolve)
    }
  }
  return function equalBy(value) {
    return value != null && typeof value.eq == 'function'
      ? value.eq(left, right)
      : sameValueZero(left, right)
  }
}

module.exports = eq
