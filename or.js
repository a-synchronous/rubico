const promiseAll = require('./_internal/promiseAll')
const isPromise = require('./_internal/isPromise')
const areAnyValuesPromises = require('./_internal/areAnyValuesPromises')
const __ = require('./_internal/placeholder')
const curry2 = require('./_internal/curry2')
const curry3 = require('./_internal/curry3')
const curryArgs2 = require('./_internal/curryArgs2')
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
    const predicate = predicates[index]
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
 *   args Array,
 *   predicates Array<predicate function|nonfunction>,
 *   index number,
 * ) -> allTruthy boolean
 * ```
 */
const asyncAreAnyPredicatesTruthy = async function (args, predicates, index) {
  const length = predicates.length
  while (++index < length) {
    let predicate = predicates[index]
    if (typeof predicate == 'function') {
      predicate = predicate(...args)
    }
    if (isPromise(predicate)) {
      predicate = await predicate
    }
    if (predicate) {
      return true
    }
  }
  return false
}

// areAnyPredicatesTruthy(args Array, predicates Array<function>) -> Promise|boolean
const areAnyPredicatesTruthy = function (args, predicates) {
  const length = predicates.length
  let index = -1

  while (++index < length) {
    let predicate = predicates[index]
    if (typeof predicate == 'function') {
      predicate = predicate(...args)
    }
    if (isPromise(predicate)) {
      return predicate.then(curry3(
        thunkConditional,
        __,
        always(true),
        thunkify3(asyncAreAnyPredicatesTruthy, args, predicates, index),
      ))
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
 * or(values Array<boolean>) -> result boolean
 *
 * or(...args, predicatesOrValues Array<function|boolean>) -> Promise|boolean
 *
 * or(predicatesOrValues Array<function|boolean>)(...args) -> Promise|boolean
 * ```
 *
 * @description
 * Tests an array of boolean values, returning true if any boolean values are truthy.
 *
 * ```javascript [playground]
 * const oneIsLessThanZero = 1 < 0
 * const oneIsGreaterThanTwo = 1 > 2
 * const threeIsNotEqualToThree = 3 !== 3
 *
 * console.log(
 *   or([oneIsLessThanZero, oneIsGreaterThanTwo, threeIsNotEqualToThree]),
 * ) // false
 * ```
 *
 * If any values in the array are synchronous or asynchronous predicate functions, `or` takes another argument to test concurrently against the predicate functions, returning true if any array values or resolved values from the predicates are truthy.
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
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * or(Promise.resolve('aaa'), [
 *   s => s.startsWith('b'),
 *   s => s.endsWith('a'),
 * ]).then(console.log) // true
 * ```
 *
 * @execution series
 *
 * @note ...args slows down here by an order of magnitude
 */
const or = function (...args) {
  const predicatesOrValues = args.pop()
  if (areAllValuesNonfunctions(predicatesOrValues)) {
    return areAnyNonfunctionsTruthy(predicatesOrValues, -1)
  }

  if (args.length == 0) {
    return curryArgs2(areAnyPredicatesTruthy, __, predicatesOrValues)
  }

  if (areAnyValuesPromises(args)) {
    return promiseAll(args)
      .then(curry2(areAnyPredicatesTruthy, __, predicatesOrValues))
  }

  return areAnyPredicatesTruthy(args, predicatesOrValues)
}

module.exports = or
