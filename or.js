const isPromise = require('./_internal/isPromise')
const curry3 = require('./_internal/curry3')
const __ = require('./_internal/placeholder')
const thunkConditional = require('./_internal/thunkConditional')
const areAllValuesNonfunctions = require('./_internal/areAllValuesNonfunctions')
const thunkify2 = require('./_internal/thunkify2')
const thunkify3 = require('./_internal/thunkify3')
const always = require('./_internal/always')

/**
 * @name areAnyNonfunctionsTruthy
 *
 * @synopsis
 * ```coffeescript [specscript]
 * areAnyNonfunctionsTruthy(predicates Array<value>) -> Promise|boolean
 * ```
 */
const areAnyNonfunctionsTruthy = function (predicates, index) {
  const length = predicates.length
  while (++index < length) {
    let predicate = predicates[index]
    if (isPromise(predicate)) {
      return predicate.then(curry3(
        thunkConditional,
        __,
        always(true),
        thunkify2(areAnyNonfunctionsTruthy, predicates, index),
      ))
    }
    if (predicate) {
      return true
    }
  }
  return false
}

/**
 * @name asyncAreAnyPredicatesTruthy
 *
 * @synopsis
 * ```coffeescript [specscript]
 * asyncAreAnyPredicatesTruthy(
 *   predicates Array<predicate function|nonfunction>,
 *   point any,
 *   index number,
 * ) -> allTruthy boolean
 * ```
 */
const asyncAreAnyPredicatesTruthy = async function (predicates, point, index) {
  const length = predicates.length
  while (++index < length) {
    let predicate = predicates[index]
    if (typeof predicate == 'function') {
      predicate = predicate(point)
    }
    console.log('hey - or', predicate)
    if (isPromise(predicate)) {
      predicate = await predicate
    }
    if (predicate) {
      return true
    }
  }
  return false
}

/**
 * @name or
 *
 * @synopsis
 * ```coffeescript [specscript]
 * or(
 *   predicates Array<predicate function|nonfunction>,
 * )(point any) -> Promise|boolean
 * ```
 *
 * @description
 * Test an array of predicates serially against a single input, returning true if any of them test truthy.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const isEven = number => number % 2 == 0
 *
 * console.log(
 *   or([isOdd, isEven])(0),
 * ) // true
 * ```
 *
 * `or` behaves eagerly if provided only nonfunction values
 *
 * ```javascript [playground]
 * console.log(
 *   or([false, false, true]),
 * ) // true
 * ```
 *
 * @execution series
 *
 * @note ...args slows down here by an order of magnitude
 */
const or = predicates => {
  if (areAllValuesNonfunctions(predicates)) {
    return areAnyNonfunctionsTruthy(predicates, -1)
  }
  return function areAnyPredicatesTruthy(point) {
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
          always(true),
          thunkify3(asyncAreAnyPredicatesTruthy, predicates, point, index),
        ))
      }
      if (predicate) {
        return true
      }
    }
    return false
  }
}

module.exports = or
