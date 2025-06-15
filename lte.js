const ComparisonOperator = require('./_internal/ComparisonOperator')
const lessThanOrEqual = require('./_internal/lessThanOrEqual')

/**
 * @name lte
 *
 * @synopsis
 * ```coffeescript [specscript]
 * args Array<any>
 * argsOrPromises Array<Promise|any>
 *
 * type SyncOrAsyncResolver = (...args)=>Promise|any
 *
 * leftValue Promise|any
 * rightValue Promise|any
 * leftResolver SyncOrAsyncResolver
 * rightResolver SyncOrAsyncResolver
 *
 * lte(leftValue, rightValue) -> Promise|boolean
 * lte(...argsOrPromises, leftResolver, rightValue) -> Promise|boolean
 * lte(...argsOrPromises, leftValue, rightResolver) -> Promise|boolean
 * lte(...argsOrPromises, leftResolver, rightResolver) -> Promise|boolean
 * lte(leftResolver, rightValue)(...args) -> Promise|boolean
 * lte(leftValue, rightResolver)(...args) -> Promise|boolean
 * lte(leftResolver, rightResolver)(...args) -> Promise|boolean
 * ```
 *
 * @description
 * Functional equivalent of the [Less than or equal (>=)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Less_than_or_equal) operator. Tests if a value is less than or equal (`<=`) to another value.
 *
 * ```javascript [playground]
 * console.log(lte(1, 3)) // true
 * console.log(lte(3, 3)) // true
 * console.log(lte(4, 3)) // false
 * ```
 *
 * If either of the two values are resolver functions, `lte` returns a function that resolves the value(s) to compare.
 *
 * ```javascript [playground]
 * const identity = value => value
 *
 * const isLessThanOrEqualTo3 = lte(identity, 3)
 *
 * console.log(isLessThanOrEqualTo3(1)) // true
 * console.log(isLessThanOrEqualTo3(3)) // true
 * console.log(isLessThanOrEqualTo3(5)) // false
 * ```
 *
 * If either of the two resolver functions is asynchronous, `lte` returns an asynchronous function.
 *
 * ```javascript [playground]
 * const asyncIdentity = async value => value
 *
 * const asyncIsLessThanOrEqualTo3 = lte(asyncIdentity, 3)
 *
 * asyncIsLessThanOrEqualTo3(1).then(console.log) // true
 * asyncIsLessThanOrEqualTo3(3).then(console.log) // true
 * asyncIsLessThanOrEqualTo3(5).then(console.log) // false
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
 *
 * See also:
 *  * [and](/docs/and)
 *  * [eq](/docs/eq)
 *  * [lt](/docs/lt)
 *  * [gt](/docs/gt)
 *  * [gte](/docs/gte)
 *  * [thunkify](/docs/thunkify)
 *
 */
const lte = ComparisonOperator(lessThanOrEqual)

module.exports = lte
