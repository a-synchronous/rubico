const ComparisonOperator = require('./_internal/ComparisonOperator')
const greaterThan = require('./_internal/greaterThan')

/**
 * @name gt
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type SyncOrAsyncResolver = (...arguments)=>Promise|any
 *
 * gt(leftValue Promise|any, rightValue Promise|any) -> Promise|boolean
 * gt(...arguments, leftResolver SyncOrAsyncResolver, rightValue Promise|any) -> Promise|boolean
 * gt(...arguments, leftValue Promise|any, rightResolver SyncOrAsyncResolver) -> Promise|boolean
 * gt(...arguments, leftResolver SyncOrAsyncResolver, rightResolver SyncOrAsyncResolver) -> Promise|boolean
 *
 * gt(leftResolver SyncOrAsyncResolver, rightValue Promise|any)(...arguments) -> Promise|boolean
 * gt(leftValue Promise|any, rightResolver SyncOrAsyncResolver)(...arguments) -> Promise|boolean
 * gt(leftResolver SyncOrAsyncResolver, rightResolver SyncOrAsyncResolver)(...arguments) -> Promise|boolean
 * ```
 *
 * @description
 * Comparison operator. Tests if a value is greater than (`>`) another value.
 *
 * ```javascript [playground]
 * const age = 40
 *
 * const isAgeGreaterThan21 = gt(age, 21)
 *
 * console.log(isAgeGreaterThan21)
 * ```
 *
 * If either of the two values are resolver functions, `gt` returns a function that resolves the values to compare.
 *
 * ```javascript [playground]
 * const isOfLegalAge = gt(get('age'), 21)
 *
 * const juvenile = { age: 16 }
 *
 * console.log(isOfLegalAge(juvenile))
 * ```
 *
 * If either of the resolver functions is asynchronous, `gt` returns an asynchronous function.
 *
 * ```javascript [playground]
 * const asyncIsOfLegalAge = gt(async person => person.age, 21)
 *
 * const juvenile = { age: 16 }
 *
 * asyncIsOfLegalAge(juvenile).then(console.log)
 * ```
 *
 * `gt` supports a lazy interface for composability.
 *
 * ```javascript [playground]
 * pipe({ value: 1 }, [
 *   gt(5, get('value')),
 *   console.log,
 * ])
 * ```
 *
 * Any promises in `arguments` are resolved for their values before further execution for the eager interface only.
 *
 * ```javascript [playground]
 * gt(Promise.resolve({ a: 2, b: 1 }), get('a'), get('b')).then(console.log)
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
