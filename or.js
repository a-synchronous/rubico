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
 * type Predicate = (...arguments)=>Promise|boolean|any
 *
 * or(values Array<boolean|any>) -> booleanResult boolean
 * or(...arguments, predicatesOrValues Array<Predicate|boolean|any>) -> booleanResult Promise|boolean
 * or(predicatesOrValues Array<Predicate|boolean|any>)(...arguments) -> booleanResult Promise|boolean
 * ```
 *
 * @description
 * Logical operator. Tests an array of predicate functions, promises, or values, returning true if any predicate tests true or any value is truthy.
 *
 * ```javascript [playground]
 * const isOddOrGreaterThan3 = or([
 *   n => n % 2 == 1,
 *   n => n > 3,
 * ])
 *
 * console.log(isOddOrGreaterThan3(2))
 * console.log(isOddOrGreaterThan3(3))
 * console.log(isOddOrGreaterThan3(6))
 * ```
 *
 * If the array contains predicate functions, `or` returns an aggregate predicate function that returns true if some predicate function test true. If any predicate function is asynchronous, the aggregate predicate function is asynchronous.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 * const isNegative = number => number < 0
 * const asyncIsGreaterThan3 = async number => number > 3
 *
 * const aggregatePredicate = or([
 *   false,
 *   isOdd,
 *   isNegative,
 *   asyncIsGreaterThan3,
 * ])
 *
 * const booleanResult = await aggregatePredicate(2)
 *
 * console.log(booleanResult)
 * ```
 *
 * If the array contains only values, `or` returns a boolean value.
 *
 * ```javascript [playground]
 * const oneIsLessThanZero = 1 < 0
 * const oneIsGreaterThanTwo = 1 > 2
 * const threeIsNotEqualToThree = 3 !== 3
 *
 * const booleanResult = or([
 *   oneIsLessThanZero,
 *   oneIsGreaterThanTwo,
 *   threeIsNotEqualToThree
 * ])
 *
 * console.log(booleanResult)
 * ```
 *
 * Any promises in the array are resolved for their values before further execution.
 *
 * ```javascript [playground]
 * or(Promise.resolve('aaa'), [
 *   s => s.startsWith('b'),
 *   s => s.endsWith('a'),
 * ]).then(console.log)
 * ```
 *
 * See also:
 *  * [some](/docs/some)
 *  * [and](/docs/and)
 *  * [not](/docs/not)
 *  * [eq](/docs/eq)
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
