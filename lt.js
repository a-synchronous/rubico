const ComparisonOperator = require('./_internal/ComparisonOperator')
const lessThan = require('./_internal/lessThan')

/**
 * @name lt
 *
 * @synopsis
 * ```coffeescript [specscript]
 * lt(leftValue Promise|any, rightValue Promise|any) -> boolean
 *
 * lt(leftValue Promise|any, right function)(...args) -> Promise|boolean
 * lt(...args, leftValue Promise|any, right function) -> Promise|boolean
 *
 * lt(left function, rightValue Promise|any)(...args) -> Promise|boolean
 * lt(...args, left function, rightValue Promise|any) -> Promise|boolean
 *
 * lt(left function, right function)(...args) -> Promise|boolean
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
 *
 * `lt` supports a lazy API for composability.
 *
 * ```javascript [playground]
 * pipe({ value: 1 }, [
 *   lt(0, get('value')),
 *   console.log, // true
 * ])
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * lt(Promise.resolve({ a: 1, b: 2 }), get('a'), get('b')).then(console.log) // true
 * ```
 */
const lt = ComparisonOperator(lessThan)

module.exports = lt
