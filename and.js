const isPromise = require('./_internal/isPromise')
const curry3 = require('./_internal/curry3')
const __ = require('./_internal/placeholder')
const thunkConditional = require('./_internal/thunkConditional')
const areAllValuesNonfunctions = require('./_internal/areAllValuesNonfunctions')
const thunkify2 = require('./_internal/thunkify2')
const thunkify3 = require('./_internal/thunkify3')
const always = require('./_internal/always')

/**
 * @name areAllNonfunctionsTruthy
 *
 * @synopsis
 * ```coffeescript [specscript]
 * areAllNonfunctionsTruthy(predicates Array<value>) -> Promise|boolean
 * ```
 */
const areAllNonfunctionsTruthy = function (predicates, index) {
  const length = predicates.length
  while (++index < length) {
    let predicate = predicates[index]
    if (isPromise(predicate)) {
      return predicate.then(curry3(
        thunkConditional,
        __,
        thunkify2(areAllNonfunctionsTruthy, predicates, index),
        always(false),
      ))
    }
    if (!predicate) {
      return false
    }
  }
  return true
}

/**
 * @name asyncArePredicatesAllTruthy
 *
 * @synopsis
 * ```coffeescript [specscript]
 * asyncArePredicatesAllTruthy(
 *   predicates Array<value=>Promise|boolean>
 *   point any,
 *   index number,
 * ) -> allTruthy boolean
 * ```
 */
const asyncArePredicatesAllTruthy = async function (predicates, point, index) {
  const length = predicates.length
  while (++index < length) {
    let predicate = predicates[index]
    if (typeof predicate == 'function') {
      predicate = predicate(point)
    }
    if (isPromise(predicate)) {
      predicate = await predicate
    }
    if (!predicate) {
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
 * and(
 *   predicates Array<predicate function|nonfunction>
 * )(point any) -> Promise|boolean
 * ```
 *
 * @description
 * Test an array of predicates or nonfunction values concurrently against a single input, returning true if all test truthy.
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
 * `and` behaves eagerly if provided only nonfunction values
 *
 * ```javascript [playground]
 * console.log(
 *   and([true, true, true]),
 * ) // true
 * ```
 *
 * @execution series
 *
 * @note ...args slows down here by an order of magnitude
 */
const and = predicates => {
  if (areAllValuesNonfunctions(predicates)) {
    return areAllNonfunctionsTruthy(predicates, -1)
  }
  return function arePredicatesAllTruthy(point) {
    const length = predicates.length
    let index = -1

    while (++index < length) {
      let predicate = predicates[index]
      if (typeof predicate == 'function') {
        predicate = predicate(point)
      }
      if (isPromise(predicate)) {
        return predicate.then(curry3(
          thunkConditional,
          __,
          thunkify3(asyncArePredicatesAllTruthy, predicates, point, index),
          always(false),
        ))
      }
      if (!predicate) {
        return false
      }
    }
    return true
  }
}

module.exports = and
