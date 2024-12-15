const ComparisonOperator = require('./_internal/ComparisonOperator')
const lessThanOrEqual = require('./_internal/lessThanOrEqual')

/**
 * @name lte
 *
 * @synopsis
 * ```coffeescript [specscript]
 * lte(leftValue Promise|any, rightValue Promise|any) -> boolean
 *
 * lte(leftValue Promise|any, right function)(...args) -> Promise|boolean
 * lte(...args, leftValue Promise|any, right function) -> Promise|boolean
 *
 * lte(left function, rightValue Promise|any)(...args) -> Promise|boolean
 * lte(...args, left function, rightValue Promise|any) -> Promise|boolean
 *
 * lte(left function, right function)(...args) -> Promise|boolean
 * lte(...args, left function, right function) -> Promise|boolean
 * ```
 *
 * @description
 * Test if a value is less than or equal (`<=`) to another value.
 *
 * ```javascript [playground]
 * console.log(lte(1, 3)) // true
 * console.log(lte(3, 3)) // true
 * console.log(lte(4, 3)) // false
 * ```
 *
 * If either of the two values are resolver functions, `lte` returns a function that resolves the values to compare from its arguments.
 *
 * ```javascript [playground]
 * const identity = value => value
 *
 * const isLessThanOrEqualTo3 = lte(identity, 3)
 *
 * console.log(isLessThanOrEqualTo3(1), true)
 * console.log(isLessThanOrEqualTo3(3), true)
 * console.log(isLessThanOrEqualTo3(5), false)
 * ```
 *
 * `lte` supports a lazy API for composability.
 *
 * ```javascript [playground]
 * pipe({ value: 1 }, [
 *   lte(1, get('value')),
 *   console.log, // true
 * ])
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * lte(Promise.resolve({ a: 1, b: 1 }), get('a'), get('b')).then(console.log) // true
 * ```
 */
const lte = ComparisonOperator(lessThanOrEqual)

module.exports = lte
