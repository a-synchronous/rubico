const ComparisonOperator = require('./_internal/ComparisonOperator')
const greaterThanOrEqual = require('./_internal/greaterThanOrEqual')

/**
 * @name gte
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
 * gte(leftValue, rightValue) -> Promise|boolean
 * gte(...argsOrPromises, leftResolver, rightValue) -> Promise|boolean
 * gte(...argsOrPromises, leftValue, rightResolver) -> Promise|boolean
 * gte(...argsOrPromises, leftResolver, rightResolver) -> Promise|boolean
 * gte(leftResolver, rightValue)(...args) -> Promise|boolean
 * gte(leftValue, rightResolver)(...args) -> Promise|boolean
 * gte(leftResolver, rightResolver)(...args) -> Promise|boolean
 * ```
 *
 * @description
 * Functional equivalent of the [Greater than or equal (>=)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Greater_than_or_equal) operator. Tests if a value is greater than or equal (`>=`) to another value.
 *
 * ```javascript [playground]
 * const age = 20
 *
 * const isAdultAge = gte(age, 18)
 *
 * console.log(isAdultAge) // true
 * ```
 *
 * If either of the two values are resolver functions, `gte` returns a function that resolves the value(s) to compare.
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
 * If either of the two resolver functions is asynchronous, `gte` returns an asynchronous function.
 *
 * ```javascript [playground]
 * const asyncIdentity = async value => value
 *
 * const asyncIsAtLeast100 = gte(asyncIdentity, 100)
 *
 * asyncIsAtLeast100(99).then(console.log) // false
 * asyncIsAtLeast100(100).then(console.log) // true
 * asyncIsAtLeast100(101).then(console.log) // true
 * ```
 *
 * `gte` supports a lazy API for composability.
 *
 * ```javascript [playground]
 * pipe({ value: 1 }, [
 *   gte(1, get('value')),
 *   console.log, // true
 * ])
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * gte(Promise.resolve({ a: 1, b: 1 }), get('a'), get('b')).then(console.log) // true
 * ```
 *
 * See also:
 *  * [and](/docs/and)
 *  * [eq](/docs/eq)
 *  * [lt](/docs/lt)
 *  * [gt](/docs/gt)
 *  * [lte](/docs/lte)
 *  * [thunkify](/docs/thunkify)
 *
 */
const gte = ComparisonOperator(greaterThanOrEqual)

module.exports = gte
