const ComparisonOperator = require('./_internal/ComparisonOperator')
const greaterThan = require('./_internal/greaterThan')

/**
 * @name gt
 *
 * @synopsis
 * ```coffeescript [specscript]
 * gt(leftValue Promise|any, rightValue Promise|any) -> boolean
 *
 * gt(leftValue Promise|any, right function)(...args) -> Promise|boolean
 * gt(...args, leftValue Promise|any, right function) -> Promise|boolean
 *
 * gt(left function, rightValue Promise|any)(...args) -> Promise|boolean
 * gt(...args, left function, rightValue Promise|any) -> Promise|boolean
 *
 * gt(left function, right function)(...args) -> Promise|boolean
 * gt(...args, left function, right function) -> Promise|boolean
 * ```
 *
 * @description
 * Test if a value is greater than (`>`) another value.
 *
 * ```javascript [playground]
 * const age = 40
 *
 * const isAgeGreaterThan21 = gt(age, 21)
 *
 * console.log(isAgeGreaterThan21) // true
 * ```
 *
 * If either of the two values are resolver functions, `gt` returns a function that resolves the values to compare from its arguments.
 *
 * ```javascript [playground]
 * const isOfLegalAge = gt(21, get('age'))
 *
 * const juvenile = { age: 16 }
 *
 * console.log(isOfLegalAge(juvenile)) // false
 * ```
 *
 * `gt` supports a lazy API for composability.
 *
 * ```javascript [playground]
 * pipe({ value: 1 }, [
 *   gt(5, get('value')),
 *   console.log, // true
 * ])
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * gt(Promise.resolve({ a: 2, b: 1 }), get('a'), get('b')).then(console.log) // true
 * ```
 */
const gt = ComparisonOperator(greaterThan)

module.exports = gt
