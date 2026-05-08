const ComparisonOperator = require('./_internal/ComparisonOperator')
const lessThan = require('./_internal/lessThan')

/**
 * @name lt
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type SyncOrAsyncResolver = (...arguments)=>Promise|any
 *
 * lt(leftValue Promise|any, rightValue Promise|any) -> Promise|boolean
 * lt(...arguments, leftResolver SyncOrAsyncResolver, rightValue Promise|any) -> Promise|boolean
 * lt(...arguments, leftValue Promise|any, rightResolver SyncOrAsyncResolver) -> Promise|boolean
 * lt(...arguments, leftResolver SyncOrAsyncResolver, rightResolver SyncOrAsyncResolver) -> Promise|boolean
 *
 * lt(leftResolver SyncOrAsyncResolver, rightValue Promise|any)(...arguments) -> Promise|boolean
 * lt(leftValue Promise|any, rightResolver SyncOrAsyncResolver)(...arguments) -> Promise|boolean
 * lt(leftResolver SyncOrAsyncResolver, rightResolver SyncOrAsyncResolver)(...arguments) -> Promise|boolean
 * ```
 *
 * @description
 * Comparison operator. Tests if a value is less than (`<`) another value.
 *
 * ```javascript [playground]
 * console.log(lt(1, 3))
 * console.log(lt(3, 3))
 * console.log(lt(4, 3))
 * ```
 *
 * If either of the two values are resolver functions, `lt` returns a function that resolves the values to compare.
 *
 * ```javascript [playground]
 * const identity = value => value
 *
 * const isLessThan3 = lt(identity, 3)
 *
 * console.log(isLessThan3(1))
 * console.log(isLessThan3(3))
 * console.log(isLessThan3(5))
 * ```
 *
 * If either of the resolver functions is asynchronous, `lt` returns an asynchronous function.
 *
 * ```javascript [playground]
 * const asyncIdentity = async value => value
 *
 * const asyncIsLessThan3 = lt(asyncIdentity, 3)
 *
 * asyncIsLessThan3(1).then(console.log)
 * asyncIsLessThan3(3).then(console.log)
 * asyncIsLessThan3(5).then(console.log)
 * ```
 *
 * `lt` supports a lazy interface for composability.
 *
 * ```javascript [playground]
 * pipe({ value: 1 }, [
 *   lt(0, get('value')),
 *   console.log,
 * ])
 * ```
 *
 * Any promises in `arguments` are resolved for their values before further execution for the eager interface only.
 *
 * ```javascript [playground]
 * lt(Promise.resolve({ a: 1, b: 2 }), get('a'), get('b')).then(console.log)
 * ```
 *
 * See also:
 *  * [and](/docs/and)
 *  * [eq](/docs/eq)
 *  * [gt](/docs/lt)
 *  * [gte](/docs/gte)
 *  * [lte](/docs/lte)
 *  * [thunkify](/docs/thunkify)
 *
 */
const lt = ComparisonOperator(lessThan)

module.exports = lt
