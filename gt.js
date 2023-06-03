const ComparisonOperator = require('./_internal/ComparisonOperator')
const greaterThan = require('./_internal/greaterThan')

/**
 * @name gt
 *
 * @synopsis
 * ```coffeescript [specscript]
 * gt(leftValue any, rightValue any) -> boolean
 *
 * gt(leftValue any, right function)(...args) -> Promise|boolean
 * gt(...args, leftValue any, right function) -> Promise|boolean
 *
 * gt(left function, rightValue any)(...args) -> Promise|boolean
 * gt(...args, left function, rightValue any) -> Promise|boolean
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
 */
const gt = ComparisonOperator(greaterThan)

module.exports = gt
