const ComparisonOperator = require('./_internal/ComparisonOperator')
const equals = require('./_internal/equals')

/**
 * @name eq
 *
 * @synopsis
 * ```coffeescript [specscript]
 * eq(leftValue any, rightValue any) -> boolean
 *
 * eq(leftValue any, right function)(...args) -> Promise|boolean
 *
 * eq(left function, rightValue any)(...args) -> Promise|boolean
 *
 * eq(left function, right function)(...args) -> Promise|boolean
 *
 * eq(...args, left function, right function) -> Promise|boolean
 * ```
 *
 * @description
 * Test for [equality (`==`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality) between two values.
 *
 * ```javascript [playground]
 * const areNamesEqual = eq('Ted', 'George')
 *
 * console.log(areNamesEqual) // false
 * ```
 *
 * If either of the two values are resolver functions, `eq` returns a function that resolves the values to compare from its arguments.
 *
 * ```javascript [playground]
 * const personIsGeorge = eq(get('name'), 'George')
 *
 * const person = { name: 'George', likes: 'bananas' }
 *
 * if (personIsGeorge(person)) {
 *   console.log('The person is george')
 * }
 * ```
 *
 * @execution concurrent
 */

const eq = ComparisonOperator(equals)

module.exports = eq
