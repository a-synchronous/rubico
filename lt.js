const ComparisonOperator = require('./_internal/ComparisonOperator')
const lessThan = require('./_internal/lessThan')

/**
 * @name lt
 *
 * @synopsis
 * ```coffeescript [specscript]
 * lt(leftValue any, rightValue any) -> boolean
 *
 * lt(leftValue any, right function)(...args) -> Promise|boolean
 *
 * lt(left function, rightValue any)(...args) -> Promise|boolean
 *
 * lt(left function, right function)(...args) -> Promise|boolean
 *
 * lt(...args, left function, right function) -> Promise|boolean
 * ```
 *
 * @description
 * Test if a value is less than (`<`) another value.
 *
 * ```javascript [playground]
 * console.log(lt(1, 3)) // true
 * console.log(lt(3, 3)) // false
 * console.log(lt(4, 3)) // false
 * ```
 *
 * If either of the two values are resolver functions, `lt` returns a function that resolves the values to compare from its arguments.
 *
 * ```javascript [playground]
 * const identity = value => value
 *
 * const isLessThan3 = lt(identity, 3)
 *
 * console.log(isLessThan3(1)) // true
 * console.log(isLessThan3(3)) // false
 * console.log(isLessThan3(5)) // false
 * ```
 */
const lt = ComparisonOperator(lessThan)

module.exports = lt
