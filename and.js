const isPromise = require('./_internal/isPromise')
const curry3 = require('./_internal/curry3')
const __ = require('./_internal/placeholder')
const thunkConditional = require('./_internal/thunkConditional')
const thunkify3 = require('./_internal/thunkify3')
const always = require('./_internal/always')

/**
 * @name asyncAnd
 *
 * @synopsis
 * ```coffeescript [specscript]
 * asyncAnd(
 *   predicates Array<value=>Promise|boolean>
 *   value any,
 *   index number,
 * ) -> allTruthy boolean
 * ```
 */
const asyncAnd = async function (predicates, value, index) {
  const length = predicates.length
  while (++index < length) {
    let predication = predicates[index](value)
    if (isPromise(predication)) {
      predication = await predication
    }
    if (!predication) {
      return false
    }
  }
  return true
}

/**
 * @name and
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var value any,
 *   predicates Array<value=>Promise|boolean>
 *
 * and(predicates)(value) -> Promise|boolean
 * ```
 *
 * @description
 * Test an array of predicates concurrently against a single input, returning true if all test truthy.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const isPositive = number => number > 0
 *
 * const isLessThan3 = number => number < 3
 *
 * console.log(
 *   and([isOdd, isPositive, isLessThan3])(1),
 * ) // true
 * ```
 *
 * @execution serial
 *
 * @note ...args slows down here by an order of magnitude
 */
const and = predicates => function allPredicates(value) {
  if (value != null && typeof value.and == 'function') {
    return value.and(predicates)
  }
  const length = predicates.length,
    promises = []
  let index = -1

  while (++index < length) {
    const predication = predicates[index](value)
    if (isPromise(predication)) {
      return predication.then(curry3(
        thunkConditional,
        __,
        thunkify3(asyncAnd, predicates, value, index),
        always(false)))
    }
    if (!predication) {
      return false
    }
  }
  return true
}

module.exports = and
