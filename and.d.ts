export = and;
/**
 * @name and
 *
 * @synopsis
 * ```coffeescript [specscript]
 * and(values Array<boolean>) -> result boolean
 *
 * and(...args, predicatesOrValues Array<function|boolean>) -> Promise|boolean
 *
 * and(predicatesOrValues Array<function|boolean>)(...args) -> Promise|boolean
 * ```
 *
 * @description
 * Tests an array of boolean values, returning true if all boolean values are truthy.
 *
 * ```javascript [playground]
 * const oneIsLessThanThree = 1 < 3
 * const twoIsGreaterThanOne = 2 > 1
 * const threeIsEqualToThree = 3 === 3
 *
 * console.log(
 *   and([oneIsLessThanThree, twoIsGreaterThanOne, threeIsEqualToThree]),
 * ) // true
 * ```
 *
 * If any values in the array are synchronous or asynchronous predicate functions, `and` takes another argument to test concurrently against the predicate functions, returning true if all array values and resolved values from the predicates are truthy.
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
 * @execution series
 *
 * @note ...args slows down here by an order of magnitude
 */
declare function and(...args: any[]): any;
