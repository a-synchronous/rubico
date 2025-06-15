const ComparisonOperator = require('./_internal/ComparisonOperator')
const greaterThan = require('./_internal/greaterThan')

/**
 * @name gt
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
 * gt(leftValue, rightValue) -> Promise|boolean
 * gt(...argsOrPromises, leftResolver, rightValue) -> Promise|boolean
 * gt(...argsOrPromises, leftValue, rightResolver) -> Promise|boolean
 * gt(...argsOrPromises, leftResolver, rightResolver) -> Promise|boolean
 * gt(leftResolver, rightValue)(...args) -> Promise|boolean
 * gt(leftValue, rightResolver)(...args) -> Promise|boolean
 * gt(leftResolver, rightResolver)(...args) -> Promise|boolean
 * ```
 *
 * @description
 * Functional equivalent of the [Greater than (>)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Greater_than) operator. Tests if a value is greater than (`>`) another value.
 *
 * ```javascript [playground]
 * const age = 40
 *
 * const isAgeGreaterThan21 = gt(age, 21)
 *
 * console.log(isAgeGreaterThan21) // true
 * ```
 *
 * If either of the two values are resolver functions, `gt` returns a function that resolves the value(s) to compare.
 *
 * ```javascript [playground]
 * const isOfLegalAge = gt(get('age'), 21)
 *
 * const juvenile = { age: 16 }
 *
 * console.log(isOfLegalAge(juvenile)) // false
 * ```
 *
 * If either of the resolver functions is asynchronous, `gt` returns an asynchronous function.
 *
 * ```javascript [playground]
 * const asyncIsOfLegalAge = gt(async person => person.age, 21)
 *
 * const juvenile = { age: 16 }
 *
 * asyncIsOfLegalAge(juvenile).then(console.log) // false
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
 *
 * See also:
 *  * [and](/docs/and)
 *  * [eq](/docs/eq)
 *  * [lt](/docs/lt)
 *  * [gte](/docs/gte)
 *  * [lte](/docs/lte)
 *  * [thunkify](/docs/thunkify)
 *
 */
const gt = ComparisonOperator(greaterThan)

module.exports = gt
