const ComparisonOperator = require('./_internal/ComparisonOperator')
const greaterThanOrEqual = require('./_internal/greaterThanOrEqual')

/**
 * @name gte
 *
 * @synopsis
 * ```coffeescript [specscript]
 * gte(leftValue Promise|any, rightValue Promise|any) -> boolean
 *
 * gte(leftValue Promise|any, right function)(...args) -> Promise|boolean
 * gte(...args, leftValue Promise|any, right function) -> Promise|boolean
 *
 * gte(left function, rightValue Promise|any)(...args) -> Promise|boolean
 * gte(...args, left function, rightValue Promise|any) -> Promise|boolean
 *
 * gte(left function, right function)(...args) -> Promise|boolean
 * gte(...args, left function, right function) -> Promise|boolean
 * ```
 *
 * @description
 * Test if a value is greater than or equal (`>=`) to another value.
 *
 * ```javascript [playground]
 * const age = 20
 *
 * const isAdultAge = gte(age, 18)
 *
 * console.log(isAdultAge) // true
 * ```
 *
 * If either of the two values are resolver functions, `gte` returns a function that resolves the values to compare from its arguments.
 *
 * ```javascript [playground]
 * const identity = value => value
 *
 * const isAtLeast100 = gte(identity, 100)
 *
 * console.log(isAtLeast100(99)) // false
 * console.log(isAtLeast100(100)) // true
 * console.log(isAtLeast100(101)) // true
 * ```
 *
 * `gte` supports a tacit API for composability.
 *
 * ```javascript [playground]
 * pipe({ value: 1 }, [
 *   gte(1, get('value')),
 *   console.log, // true
 * ])
 * ```
 */
const gte = ComparisonOperator(greaterThanOrEqual)

module.exports = gte
