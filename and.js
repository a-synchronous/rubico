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
 * args Array<any>
 * argsOrPromises Array<Promise|any>
 *
 * type SyncOrAsyncPredicate = (...args)=>Promise|boolean|any
 *
 * predicatesOrValues Array<SyncOrAsyncPredicate|boolean|any>
 *
 * and(values Array<boolean|any>) -> result boolean
 * and(...argsOrPromises, predicatesOrValues) -> Promise|boolean
 * and(predicatesOrValues)(...args) -> Promise|boolean
 * ```
 *
 * @description
 * Function equivalent to the [Logical AND](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND) operator. Tests an array of predicate functions, promises, values, or a mix thereof.
 *
 * If provided an array of boolean values, `and` returns true if all boolean values are true.
 *
 * ```javascript [playground]
 * const oneIsLessThanThree = 1 < 3
 * const twoIsGreaterThanOne = 2 > 1
 * const threeIsEqualToThree = 3 === 3
 *
 * const condition = and([
 *   oneIsLessThanThree,
 *   twoIsGreaterThanOne,
 *   threeIsEqualToThree
 * ])
 * console.log(condition) // true
 * ```
 *
 * If any predicate functions are provided in the array, `and` returns an aggregate predicate function that returns true for a given set of arguments if all provided predicate functions test true. If any provided predicate functions are asynchronous, the aggregate predicate function becomes asynchronous.
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
 * const condition = await aggregatePredicate(1)
 * console.log(condition) // true
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * and(Promise.resolve(5), [
 *   n => n > 0,
 *   n => n < 10,
 * ]).then(console.log) // true
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
