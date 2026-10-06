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
 * @name areAllValuesTruthy
 *
 * @synopsis
 * ```coffeescript [specscript]
 * areAllValuesTruthy(predicates Array<value>) -> Promise|boolean
 * ```
 */
const areAllValuesTruthy = function (predicates, index) {
  const length = predicates.length
  while (++index < length) {
    const predicate = predicates[index]
    if (isPromise(predicate)) {
      return predicate.then(curry3(
        thunkConditional,
        __,
        thunkify2(areAllValuesTruthy, predicates, index),
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
 *   args Array,
 *   index number,
 * ) -> allTruthy boolean
 * ```
 */
const asyncArePredicatesAllTruthy = async function (args, predicates, index) {
  const length = predicates.length
  while (++index < length) {
    let predicate = predicates[index]
    if (typeof predicate == 'function') {
      predicate = predicate(...args)
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

// areAllPredicatesTruthy(args Array, predicates Array<function>) -> Promise|boolean
const areAllPredicatesTruthy = function (args, predicates) {
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
        thunkify3(asyncArePredicatesAllTruthy, args, predicates, index),
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
 * @name and
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Predicate = (...arguments)=>Promise|boolean|any
 *
 * and(values Array<Promise|boolean|any>) -> booleanResult boolean
 * and(...arguments, predicatesOrValues Array<Predicate|Promise|boolean|any>) -> booleanResult Promise|boolean
 * and(argument, ...predicatesOrValues Arguments<Predicate|Promise|boolean|any>) -> booleanResult Promise|boolean
 * and(predicatesOrValues Array<Predicate|Promise|boolean|any>)(...arguments) -> booleanResult Promise|boolean
 * ```
 *
 * @description
 * Logical operator. Tests an array of predicate functions, promises, or values, returning true if all predicates test true and all values are truthy.
 *
 * ```javascript [playground]
 * const isOddAndGreaterThan3 = and([
 *   n => n % 2 == 1,
 *   n => n > 3,
 * ])
 *
 * console.log(isOddAndGreaterThan3(5))
 * console.log(isOddAndGreaterThan3(3))
 * console.log(isOddAndGreaterThan3(6))
 * ```
 *
 * If the array contains predicate functions, `and` returns an aggregate predicate function that returns true if all predicate functions test true. If any predicate function is asynchronous, the aggregate predicate function is asynchronous.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 * const isPositive = number => number > 0
 * const asyncIsLessThan3 = async number => number < 3
 *
 * const aggregatePredicate = and([
 *   true,
 *   isOdd,
 *   isPositive,
 *   asyncIsLessThan3,
 * ])
 *
 * const booleanResult = await aggregatePredicate(1)
 *
 * console.log(booleanResult)
 * ```
 *
 * If the array contains only values, `and` returns a boolean value.
 *
 * ```javascript [playground]
 * const oneIsLessThanThree = 1 < 3
 * const twoIsGreaterThanOne = 2 > 1
 * const threeIsEqualToThree = 3 === 3
 *
 * const booleanResult = and([
 *   oneIsLessThanThree,
 *   twoIsGreaterThanOne,
 *   threeIsEqualToThree
 * ])
 *
 * console.log(booleanResult)
 * ```
 *
 * A single argument and one or more predicate functions passed to `and` executes immediately.
 *
 * ```javascript [playground]
 * const bool = and(
 *   3,
 *   n => n > 1,
 *   n => n % 2 == 1,
 *   n => n / 3 == 1,
 * )
 *
 * console.log(bool)
 * ```
 *
 * Any promises in the array are resolved for their values before further execution.
 *
 * ```javascript [playground]
 * and(Promise.resolve(5), [
 *   n => n > 0,
 *   n => n < 10,
 * ]).then(console.log)
 * ```
 *
 * See also:
 *  * [some](/docs/some)
 *  * [or](/docs/or)
 *  * [not](/docs/not)
 *  * [eq](/docs/eq)
 *
 * @execution series
 *
 * @note ...args slows down here by an order of magnitude
 */
const and = function (...args) {
  if (typeof args[1] == 'function') {
    const arg = args.shift()
    return isPromise(arg)
      ? arg.then(curryArgs2(areAllPredicatesTruthy, __, args))
      : areAllPredicatesTruthy([arg], args)
  }

  const predicatesOrValues = args.pop()
  if (areAllValuesNonfunctions(predicatesOrValues)) {
    return areAllValuesTruthy(predicatesOrValues, -1)
  }

  if (args.length == 0) {
    return curryArgs2(areAllPredicatesTruthy, __, predicatesOrValues)
  }

  if (areAnyValuesPromises(args)) {
    return promiseAll(args)
      .then(curry2(areAllPredicatesTruthy, __, predicatesOrValues))
  }

  return areAllPredicatesTruthy(args, predicatesOrValues)
}

module.exports = and
