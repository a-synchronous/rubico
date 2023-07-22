export = or;
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
 * @execution series
 *
 * @note ...args slows down here by an order of magnitude
 */
declare function or(...args: any[]): any;
