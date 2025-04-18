const ComparisonOperator = require('./_internal/ComparisonOperator')
const equals = require('./_internal/equals')

/**
 * @name eq
 *
 * @synopsis
 * ```coffeescript [specscript]
 * eq(leftValue Promise|any, rightValue Promise|any) -> boolean
 *
 * eq(leftValue Promise|any, right function)(...args) -> Promise|boolean
 * eq(...args, leftValue Promise|any, right function) -> Promise|boolean
 *
 * eq(left function, rightValue Promise|any)(...args) -> Promise|boolean
 * eq(...args, left function, rightValue Promise|any) -> Promise|boolean
 *
 * eq(left function, right function)(...args) -> Promise|boolean
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
 * `eq` supports a lazy API for composability.
 *
 * ```javascript [playground]
 * pipe({ name: 'George' }, [
 *   eq('George', get('name')),
 *   console.log, // true
 * ])
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * eq(Promise.resolve({ a: 1, b: 1 }), get('a'), get('b')).then(console.log) // true
 * ```
 *
 * @execution concurrent
 */

const eq = ComparisonOperator(equals)

module.exports = eq
